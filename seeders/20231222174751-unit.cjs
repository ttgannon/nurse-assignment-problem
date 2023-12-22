'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Units', [{
    name: 'NURS-01',
    createdAt: new Date(),
    updatedAt: new Date()
   },
   {
    name: 'NURS-02',
    createdAt: new Date(),
    updatedAt: new Date()
   },
   {
    name: 'NURS-03',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-04',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-10',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-20',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-30',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-40',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-50',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-60',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-70',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-80',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-90',
    createdAt: new Date(),
    updatedAt: new Date()
   },{
    name: 'NURS-100',
    createdAt: new Date(),
    updatedAt: new Date()
   }
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Units', null, {})
  }
};
