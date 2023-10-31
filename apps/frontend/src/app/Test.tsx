import { gql, useQuery } from "@apollo/client";
import * as React from "react";

const GET_LOCATIONS = gql`
  query GetLocations {
    users {
      id
      email
      firstName
      lastName
      createdAt
      updatedAt
      isActive
      __typename
    }
  }
`;

function Test() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return <div>Test</div>;
}

export default Test;
