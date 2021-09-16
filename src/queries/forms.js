import gql from "graphql-tag";

export const SUBMIT_CONTACT_FORM = gql`
  mutation ($customerName: String, $email: String, $description: String) {
    submitContactForm(
      customerName: $customerName
      email: $email
      description: $description
    )
  }
`;
