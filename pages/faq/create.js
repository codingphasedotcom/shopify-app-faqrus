import { useState, useCallback } from "react";
import {
  Heading,
  Page,
  Card,
  Layout,
  FormLayout,
  TextField,
  EmptyState,
  DataTable,
  rows,
  Form,
  Button,
} from "@shopify/polaris";
import { Provider, TitleBar } from "@shopify/app-bridge-react";

const FAQCreate = (props) => {
  const [newsletter, setNewsletter] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback((_event) => {
    setEmail("");
    setNewsletter(false);
  }, []);

  const handleNewsLetterChange = useCallback(
    (value) => setNewsletter(value),
    []
  );

  const handleEmailChange = useCallback((value) => setEmail(value), []);
  const [value, setValue] = useState('1776 Barnes Street\nOrlando, FL 32801');

  const handleChange = useCallback((newValue) => setValue(newValue), []);
  return (
    <Page
      breadcrumbs={[{ content: "Back", url: "/" }]}
      title="Create FAQ"
      primaryAction={{ content: "Next", disabled: false }}
    >
      <TitleBar title="Create FAQ" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={email}
                  onChange={handleEmailChange}
                  label="Title"
                  type="email"
                  autoComplete="email"
                  helpText={
                    <span>
                      We’ll use this email address to inform you on future
                      changes to Polaris.
                    </span>
                  }
                />
                <TextField
                  label="Description"
                  value={""}
                  onChange={handleChange}
                  multiline={4}
                  autoComplete="off"
                />

                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default FAQCreate;
