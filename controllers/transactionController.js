
const { Transaction, Category, UserProfile } = require('../models');

// Create a transaction
exports.createTransaction = async (req, res) => {
  try {
    const { type, category_details, amount, date, description } = req.body;
    const { category_name, category_type} = category_details
    const user_id = req.user.user_id; 

    // create category
    



    const transaction = await Transaction.create({ type, category_id, amount, date, description, user_id });
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Get user ID from the token
    const transactions = await Transaction.findAll({
      where: { user_id },
      include: [{ model: Category, as: 'category' }]
    });
    return res.status(200).json(transactions);
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

    transaction.type = type;
    transaction.category_id = category_id;
    transaction.amount = amount;
    transaction.date = date;
    transaction.description = description;
    
    await transaction.save();

    return res.status(200).json(transaction);
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
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get a summary of transactions
exports.getSummary = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Get user ID from the token
    const summary = await Transaction.findAll({
      where: { user_id },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['type'],
    });

    return res.status(200).json(summary);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
