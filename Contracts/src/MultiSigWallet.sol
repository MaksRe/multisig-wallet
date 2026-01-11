// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MultiSigWallet
 * @dev Базовый мультиподписной кошелёк
 * 
 * Функционал:
 * - Несколько владельцев (owners)
 * - Создание транзакций
 * - Подпись транзакции владельцами
 * - Исполнение транзакции при достижении необходимого количества подписей
 */

contract MultiSigWallet {
    
    // ============ Events ============
    
    /// @dev Событие при создании транзакции
    event TransactionCreated(
        uint indexed txId,
        address indexed creator,
        address indexed recipient,
        uint amount,
        bytes data
    );
    
    /// @dev Событие при подписании транзакции
    event TransactionSigned(uint indexed txId, address indexed signer);
    
    /// @dev Событие при исполнении транзакции
    event TransactionExecuted(uint indexed txId);
    
    /// @dev Событие при отмене подписи
    event SignatureCancelled(uint indexed txId, address indexed signer);
    
    /// @dev Событие при поступлении эфира
    event Deposit(address indexed depositor, uint amount, uint balance);
    
    // ============ State Variables ============
    
    /// @dev Адреса владельцев кошелька
    address[] public owners;
    
    /// @dev Маппинг для быстрой проверки владельца
    mapping(address => bool) public isOwner;
    
    /// @dev Количество подписей, необходимое для исполнения транзакции
    uint public requiredSignatures;
    
    /// @dev Структура транзакции
    struct Transaction {
        address to;              // Адрес получателя
        uint value;              // Количество эфира
        bytes data;              // Данные для вызова
        bool executed;           // Была ли исполнена
        uint confirmations;      // Количество подписей
    }
    
    /// @dev Массив всех транзакций
    Transaction[] public transactions;
    
    /// @dev Маппинг: txId => адрес владельца => подписал ли
    mapping(uint => mapping(address => bool)) public confirmations;
    
    // ============ Modifiers ============
    
    /// @dev Проверка что вызывающий адрес — владелец
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }
    
    /// @dev Проверка что транзакция существует
    modifier txExists(uint _txId) {
        require(_txId < transactions.length, "Transaction does not exist");
        _;
    }
    
    /// @dev Проверка что транзакция ещё не исполнена
    modifier notExecuted(uint _txId) {
        require(!transactions[_txId].executed, "Transaction already executed");
        _;
    }
    
    /// @dev Проверка что владелец ещё не подписал
    modifier notConfirmed(uint _txId) {
        require(!confirmations[_txId][msg.sender], "Transaction already confirmed");
        _;
    }
    
    // ============ Constructor ============
    
    /**
     * @dev Инициализирует мультисиг кошелёк
     * @param _owners Массив адресов владельцев
     * @param _requiredSignatures Количество необходимых подписей
     */
    constructor(address[] memory _owners, uint _requiredSignatures) {
        require(_owners.length > 0, "Owners required");
        require(
            _requiredSignatures > 0 && _requiredSignatures <= _owners.length,
            "Invalid number of required signatures"
        );
        
        // Добавляем владельцев
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        requiredSignatures = _requiredSignatures;
    }
    
    // ============ External Functions ============
    
    /**
     * @dev Получить количество владельцев
     */
    function getOwnerCount() external view returns (uint) {
        return owners.length;
    }
    
    /**
     * @dev Получить количество транзакций
     */
    function getTransactionCount() external view returns (uint) {
        return transactions.length;
    }
    
    /**
     * @dev Получить информацию о транзакции
     */
    function getTransaction(uint _txId)
        external
        view
        txExists(_txId)
        returns (
            address to,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction memory transaction = transactions[_txId];
        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.confirmations
        );
    }
    
    /**
     * @dev Создать новую транзакцию
     * @param _to Адрес получателя
     * @param _value Количество эфира для отправки
     * @param _data Данные для вызова (пусто для простого перевода)
     */
    function createTransaction(
        address _to,
        uint _value,
        bytes memory _data
    ) external onlyOwner {
        require(_to != address(0), "Invalid recipient");
        
        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                confirmations: 0
            })
        );
        
        uint txId = transactions.length - 1;
        emit TransactionCreated(txId, msg.sender, _to, _value, _data);
    }
    
    /**
     * @dev Подписать транзакцию
     * @param _txId ID транзакции
     */
    function confirmTransaction(uint _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
        notConfirmed(_txId)
    {
        confirmations[_txId][msg.sender] = true;
        transactions[_txId].confirmations += 1;
        
        emit TransactionSigned(_txId, msg.sender);
        
        // Автоматически исполняем если достаточно подписей
        if (transactions[_txId].confirmations >= requiredSignatures) {
            executeTransaction(_txId);
        }
    }
    
    /**
     * @dev Отменить подпись (если ещё не исполнена)
     * @param _txId ID транзакции
     */
    function revokeConfirmation(uint _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
    {
        require(confirmations[_txId][msg.sender], "Transaction not confirmed");
        
        confirmations[_txId][msg.sender] = false;
        transactions[_txId].confirmations -= 1;
        
        emit SignatureCancelled(_txId, msg.sender);
    }
    
    /**
     * @dev Исполнить транзакцию
     * @param _txId ID транзакции
     */
    function executeTransaction(uint _txId)
        public
        txExists(_txId)
        notExecuted(_txId)
    {
        require(
            transactions[_txId].confirmations >= requiredSignatures,
            "Not enough confirmations"
        );
        
        Transaction storage transaction = transactions[_txId];
        transaction.executed = true;
        
        // Отправляем эфир или вызываем функцию
        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Transaction failed");
        
        emit TransactionExecuted(_txId);
    }
    
    /**
     * @dev Получить баланс контракта
     */
    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
    
    // ============ Receive Function ============
    
    /**
     * @dev Получать эфир на адрес контракта
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
}
