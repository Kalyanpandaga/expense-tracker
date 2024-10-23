
const { Transaction, Category, sequelize } = require('../models');

// Create a transaction
exports.createTransaction = async (req, res) => {
  try {
    const { type, category_details, amount, date, description } = req.body;
    const { category_name, category_type } = category_details;
    const user_id = req.user.user_id; 

    // Create or find the category
    const [category, created] = await Category.findOrCreate({
      where: { name: category_name, type: category_type },
      defaults: { name: category_name, type: category_type }
    });

    // Create the transaction
    const transaction = await Transaction.create({
      type,
      category_id: category.id,
      amount,
      date,
      description,
      user_id
    });

    // Return only the transaction ID
    return res.status(201).json({ transaction_id: transaction.id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};



// Get all transactions with limit and offset
exports.getTransactions = async (req, res) => {
  try {
    const user_id = req.user.user_id; 
    const { limit = 10, offset = 0 } = req.query; 

    const transactions = await Transaction.findAndCountAll({
      where: { user_id },
      include: [{ model: Category, as: 'category' }],
      limit: parseInt(limit), 
      offset: parseInt(offset)
    });

    // Send total count and transactions
    return res.status(200).json({
      total_transactions: transactions.count,
      transactions: transactions.rows
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get a transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id },
      include: [{ model: Category, as: 'category' }]
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category_id, amount, date, description } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update the transaction fields
    transaction.type = type;
    transaction.category_id = category_id;
    transaction.amount = amount;
    transaction.date = date;
    transaction.description = description;

    await transaction.save();

    return res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();
    return res.status(201).json({ message: 'Transaction Deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get a summary of transactions
exports.getSummary = async (req, res) => {
  try {
    const user_id = req.user.user_id; 
    const summary = await Transaction.findAll({
      where: { user_id },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        'type'  
      ],
      group: ['type'], // Group by transaction type
    });

    return res.status(200).json(summary);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

