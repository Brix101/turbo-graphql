import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';

export const GraphQLConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  context: ({ req, res }) => ({ req, res }),
  playground: {
    settings: {
      'request.credentials': 'include',
    },
  },
};
