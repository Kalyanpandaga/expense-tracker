module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
      }
    }, {
      timestamps: true
    });
  
    // Define association with Transaction model
    Category.associate = (models) => {
      Category.hasMany(models.Transaction, {
        foreignKey: 'category_id',
        as: 'transactions',
      });
    };
  
    return Category;
  };