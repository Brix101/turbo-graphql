const resolvers = {
  Record: {
    id: (parent) => parent.id ?? parent._id,
  },
  Query: {
    async record(_, { id }) {
      console.log(id);
      return [];
    },
    async records(_, __, context) {
      console.log(context);
      return [];
    },
  },
  Mutation: {
    async createRecord(_, { name, position, level }, context) {
      return null;
    },
    async updateRecord(_, args, context) {
      return null;
    },
    async deleteRecord(_, { id }, context) {
      return true;
    },
  },
};

export default resolvers;
