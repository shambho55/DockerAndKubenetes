Transaction Object = {
   amount:number;
   toVpa:uuid@bankhandle;
   fromVpa:uuid@bankhandle;
   to_previous: transaction hash of payee previous transaction;
   from_previous: transaction hash of payer previous transaction;
}


User Level Transaction Reconciliation

Starting from genesis block  (How to handle in case of multiple genesis block?)
    Genesis block should have users's current wallet balance
Define two pointers current and previous (initially current and previous will be same)
            current should always to pointing to latest block
            however previous is always having hash(memory address) of current block 
Traverse all paths and mark each visited vertices as true in dynamic array (Can be optimised)
verify each component connection that previous has hash of present block (How to handle verifying multiple forks ? )
While traversing 
   Payer : in case of transfer outward subtract transfer amount from current wallet balance
   Payee : in case of transfer inward add transfer amount to current wallet balance
While validating
   if found user is trying to transact more amount that current balance , then fail the transaction


Central Reconciliation Layer

Starting from genesis block  (How to handle in case of multiple genesis block?)
    Genesis block should have users's current wallet balance
Maintain all banks current balance
Traverse all paths and mark each visited vertices as true in dynamic array (Can be optimised)
        if same vertices found twice user address to be blacklisted. (All transactions amount should be freezed).
verify each component connection that previous has hash of present block (How to handle verifying multiple forks ?)
While traversing 
   Payer : in case of transfer outward subtract transfer amount from current wallet balance (respective bank balance should be deducted in case of offus transfer)
   Payee : in case of transfer inward add transfer amount to current wallet balance (respective bank balance should be credited in case of offus inward)
While validating at each stage it should create hash(t3) = hash(t1,t2) and persist in DB as a state of Reconciliation
   if found user is trying to transact more amount that current balance , then fail all transactions starting this transaction.
After validating all transaction a merkle root should be formed in case some other user came online with
same set of transactions so following same path same merkle root to be formed for validation which can be 
checked in DB.





