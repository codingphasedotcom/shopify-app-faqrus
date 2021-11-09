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

const QAEditPage = (props) => {
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
      title="Edit Question and Answer"
      primaryAction={{ content: "Save", disabled: false }}
    >
      <TitleBar title="Create Question and Answer" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={email}
                  onChange={handleEmailChange}
                  label="Question"
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
                  label="Answer"
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

QAEditPage.getInitialProps = async (ctx) => {
  return { faqEditId: ctx.query.faqEditId };
};

export default QAEditPage;
