// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/MultiSigWallet.sol";

contract MultiSigWalletTest is Test {
    event TransactionCreated(
        uint indexed txId,
        address indexed creator,
        address indexed recipient,
        uint amount,
        bytes data
    );

    event TransactionSigned(uint indexed txId, address indexed signer);
    event TransactionExecuted(uint indexed txId);

    event SignatureCancelled(uint indexed txId, address indexed signer);
    event Deposit(address indexed depositor, uint amount, uint balance);

    MultiSigWallet private wallet;
    address private owner1 = address(0xA11CE);
    address private owner2 = address(0xB0B);
    address private owner3 = address(0xC0C0A);
    address private nonOwner = address(0xD00D);
    address private recipient = address(0xE11E);

    function setUp() public {
        address[] memory owners = new address[](3);
        owners[0] = owner1;
        owners[1] = owner2;
        owners[2] = owner3;
        wallet = new MultiSigWallet(owners, 2);
    }

    /// @dev Проверяет, что конструктор корректно сохраняет список владельцев, кворум и заполняет mapping isOwner.
    function testConstructorSetsOwnersAndRequiredSignatures() public view {
        assertEq(wallet.getOwnerCount(), 3);
        assertEq(wallet.requiredSignatures(), 2);
        assertTrue(wallet.isOwner(owner1));
        assertTrue(wallet.isOwner(owner2));
        assertTrue(wallet.isOwner(owner3));
        assertFalse(wallet.isOwner(nonOwner));
    }

    /// @dev Убеждается, что createTransaction записывает получателя, сумму, calldata и выставляет флаги по умолчанию.
    function testCreateTransactionStoresData() public {
        bytes memory data = hex"1234";
        vm.expectEmit(true, true, true, true);
        emit TransactionCreated(0, owner1, recipient, 1 ether, data);

        vm.prank(owner1);
        wallet.createTransaction(recipient, 1 ether, data);

        assertEq(wallet.getTransactionCount(), 1);
        (address to, uint value, bytes memory storedData, bool executed, uint confirmations) =
            wallet.getTransaction(0);
        assertEq(to, recipient);
        assertEq(value, 1 ether);
        assertEq(storedData, data);
        assertFalse(executed);
        assertEq(confirmations, 0);
    }

    /// @dev Подтверждает, что не-владелец не может создать транзакцию и получает revert "Not an owner".
    function testCreateTransactionOnlyOwner() public {
        vm.expectRevert(bytes("Not an owner"));
        vm.prank(nonOwner);
        wallet.createTransaction(recipient, 1 ether, "");
    }

    /// @dev Проверяет, что confirm генерирует событие и запрещает повторное подтверждение тем же владельцем.
    function testConfirmTransactionEmitsAndPreventsDoubleConfirm() public {
        uint txId = _createTx();

        vm.expectEmit(true, true, false, false);
        emit TransactionSigned(txId, owner1);
        vm.prank(owner1);
        wallet.confirmTransaction(txId);

        vm.expectRevert(bytes("Transaction already confirmed"));
        vm.prank(owner1);
        wallet.confirmTransaction(txId);
    }

    /// @dev Валидирует, что executeTransaction ревертится, пока не набрано требуемое число подтверждений.
    function testExecuteTransactionRequiresConfirmations() public {
        uint txId = _createTx();
        _fund(2 ether);

        vm.expectRevert(bytes("Not enough confirmations"));
        wallet.executeTransaction(txId);

        vm.prank(owner1);
        wallet.confirmTransaction(txId);

        vm.expectRevert(bytes("Not enough confirmations"));
        wallet.executeTransaction(txId);
    }

    /// @dev Убеждается, что при достижении кворума confirm вызывает автоисполнение и переводит средства.
    function testConfirmAndAutoExecute() public {
        uint txId = _createTx();
        _fund(3 ether);

        vm.prank(owner1);
        wallet.confirmTransaction(txId);

        vm.expectEmit(true, false, false, false);
        emit TransactionExecuted(txId);
        vm.prank(owner2);
        wallet.confirmTransaction(txId);

        (, , , bool executed, uint confirmations) = wallet.getTransaction(txId);
        assertTrue(executed);
        assertEq(confirmations, 2);
        assertEq(recipient.balance, 1 ether);
    }

    /// @dev Подтверждает, что владелец может отозвать подпись и счетчик подтверждений уменьшается.
    function testRevokeConfirmation() public {
        uint txId = _createTx();

        vm.prank(owner1);
        wallet.confirmTransaction(txId);

        vm.prank(owner1);
        wallet.revokeConfirmation(txId);

        (, , , bool executed, uint confirmations) = wallet.getTransaction(txId);
        assertFalse(executed);
        assertEq(confirmations, 0);

        vm.expectRevert(bytes("Transaction not confirmed"));
        vm.prank(owner1);
        wallet.revokeConfirmation(txId);
    }

    /// @dev Проверяет, что revokeConfirmation генерирует событие SignatureCancelled.
    function testRevokeEmitsEvent() public {
        uint txId = _createTx();

        vm.prank(owner1);
        wallet.confirmTransaction(txId);

        vm.expectEmit(true, true, false, false);
        emit SignatureCancelled(txId, owner1);
        vm.prank(owner1);
        wallet.revokeConfirmation(txId);
    }

    /// @dev Проверяет, что receive() вызывает событие Deposit и увеличивает баланс кошелька.
    function testReceiveEmitsDeposit() public {
        uint amount = 0.5 ether;
        address depositor = address(0xDADA);
        vm.deal(depositor, amount);

        vm.expectEmit(true, false, false, true);
        emit Deposit(depositor, amount, amount);
        vm.prank(depositor);
        (bool ok, ) = address(wallet).call{value: amount}("");
        assertTrue(ok);
        assertEq(address(wallet).balance, amount);
    }

    /// @dev Убеждается, что не-владельцы не могут подтверждать или отзывать и получают revert "Not an owner".
    function testNonOwnerCannotConfirmOrRevoke() public {
        uint txId = _createTx();

        vm.expectRevert(bytes("Not an owner"));
        vm.prank(nonOwner);
        wallet.confirmTransaction(txId);

        vm.expectRevert(bytes("Not an owner"));
        vm.prank(nonOwner);
        wallet.revokeConfirmation(txId);
    }

    /// @dev Подтверждает, что обращения к несуществующему txId приводят к revert "Transaction does not exist".
    function testTransactionDoesNotExistReverts() public {
        vm.expectRevert(bytes("Transaction does not exist"));
        wallet.getTransaction(0);

        vm.expectRevert(bytes("Transaction does not exist"));
        vm.prank(owner1);
        wallet.confirmTransaction(0);
    }

    /// @dev Фазз-тест: создание и исполнение транзакции с произвольным получателем и суммой в разумных пределах.
    function testFuzzCreateConfirmAndExecute(address to, uint96 amount) public {
        vm.assume(to != address(0));
        vm.assume(to != address(wallet));

        uint256 value = uint256(amount % 1 ether) + 1 wei;
        vm.prank(owner1);
        wallet.createTransaction(to, value, "");

        _fund(value);

        uint256 before = to.balance;
        vm.prank(owner1);
        wallet.confirmTransaction(0);
        vm.prank(owner2);
        wallet.confirmTransaction(0);

        uint256 afterBalance = to.balance;
        assertEq(afterBalance, before + value);
    }

    /// @dev Убеждается, что повторное выполнение уже исполненной транзакции ревертится.
    function testCannotExecuteTwice() public {
        uint txId = _createTx();
        _fund(2 ether);

        vm.prank(owner1);
        wallet.confirmTransaction(txId);

        vm.prank(owner2);
        wallet.confirmTransaction(txId);

        vm.expectRevert(bytes("Transaction already executed"));
        wallet.executeTransaction(txId);
    }

    /// @dev Проверяет, что после исполнения транзакции дополнительные подтверждения отклоняются.
    function testCannotConfirmExecutedTransaction() public {
        uint txId = _createTx();
        _fund(2 ether);

        vm.prank(owner1);
        wallet.confirmTransaction(txId);

        vm.prank(owner2);
        wallet.confirmTransaction(txId);

        vm.expectRevert(bytes("Transaction already executed"));
        vm.prank(owner3);
        wallet.confirmTransaction(txId);
    }

    function _createTx() private returns (uint) {
        vm.prank(owner1);
        wallet.createTransaction(recipient, 1 ether, "");
        return wallet.getTransactionCount() - 1;
    }

    function _fund(uint amount) private {
        address depositor = address(0xBEEF);
        vm.deal(depositor, amount);
        vm.prank(depositor);
        (bool ok, ) = address(wallet).call{value: amount}("");
        assertTrue(ok);
    }
}
