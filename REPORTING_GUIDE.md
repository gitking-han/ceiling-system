# Factory ERP Reporting Guide

## 1. Recommended workflow to keep reports accurate

Use the following sequence for a balanced daily or monthly report:

1. Wet Production
   - Enter the wet plates produced.
   - Example: 1000 wet plates.
   - This creates the first production stage and deducts plaster stock.

2. Dry Production
   - Enter the dry plates produced from the wet batch.
   - Example: 980 dry plates from 1000 wet plates.
   - The difference (20 plates) becomes waste/defect quantity automatically.

3. Final Production
   - Enter the final plates produced from dry stock.
   - Example: 950 final plates from 980 dry plates.
   - This deducts formula-based material consumption and updates the final stock position.

4. Labour Entries
   - Create or select operators for wet, dry, and final stages.
   - Use the default labour rate of Rs. 18 per plate for report accuracy.
   - When you save wet, dry, and final production entries, the labour ledger is updated automatically for the selected operator.
   - For the report, labour is applied against the effective final-plate basis, so a 950-plate final run should reflect labour cost near 950 × 18 = Rs. 17,100.

5. Supplier and Inventory
   - Record supplier purchases and payments in the supplier ledger.
   - Keep raw material stock levels realistic so the final production deductions are valid.
   - If supplier payments are entered, they should appear in the supplier ledger and not be counted as sales revenue.

6. Customer and Sales
   - Create or select a customer first.
   - Record the sales invoice with the actual dispatched quantity and sale rate.
   - Example: sell 950 plates at Rs. 20 each -> revenue = Rs. 19,000.
   - The customer ledger will record the debit for the invoice.

7. Customer Payment Receipt
   - Record the customer payment against the customer ledger.
   - This will reduce the customer outstanding balance but does not create revenue again.

## 2. Example values that should produce a positive profit

For the example flow below:

- Wet production: 1000 plates
- Dry production: 980 plates
- Final production: 950 plates
- Sales: 950 plates × Rs. 20 = Rs. 19,000 revenue
- Labour cost: 950 × Rs. 18 = Rs. 17,100
- Material cost: use actual formula-based stock consumption
- Other expenses: enter only real operational expenses

With that setup, profit is expected to be:

Profit = Revenue - Material Cost - Labour Cost - Other Expenses

If other expenses are zero, the report can remain positive if material cost is lower than Rs. 1,900.

## 3. Entry amounts to use

### Wet Production
- Example: 1000 wet plates
- Plaster deduction is based on the formula in Formula Settings.

### Dry Production
- Example: received 1000 wet plates, produced 980 dry plates
- Waste automatically becomes 20 plates

### Final Production
- Example: received 980 dry plates, produced 950 final plates
- Waste automatically becomes 30 plates

### Labour
- Default rate: Rs. 18 per plate
- Example: 950 final plates => Rs. 17,100 labour cost

### Supplier
- Example: buy raw materials worth Rs. 50,000
- Record the purchase in supplier ledger and make payments as needed

### Customer
- Example: create customer with opening balance of Rs. 0
- Record sales invoice for Rs. 19,000
- Record payment receipt of Rs. 19,000

### Sales Invoice
- Example: quantity 950, rate Rs. 20, discount Rs. 0
- Revenue = Rs. 19,000

## 4. How to keep reports correct

- Always create production entries before sales.
- Always record labour against the same production run if you want labour cost to be linked to that run.
- Avoid entering duplicate labour expenses in both labour and expenses unless you intend to double-count labour.
- If you want the report to show positive profit, keep material consumption and operational expense values realistic.
- Use the report range filter so the report reflects only the relevant date range.
