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
  
  const [titleValue, setTitleValue] = useState('');
  const handleTitleChange = (value) => setTitleValue(value);

  const [descriptionValue, setDescriptionValue] = useState('');
  const handleDescriptionChange = (value) => setDescriptionValue(value);
  

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  const clickedBtn = () => {
    console.log('clickedBtn')
    props.authAxios.post('/faq', {
      title: titleValue,
      description: descriptionValue
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error))
  }
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
                  onChange={handleTitleChange}
                  label="Title"
                  type="text"
                  value={titleValue}
                  helpText={
                    <span>
                      We’ll use this email address to inform you on future
                      changes to Polaris.
                    </span>
                  }
                />
                <TextField
                  label="Description"
                  value={descriptionValue}
                  onChange={handleDescriptionChange}
                  multiline={4}
                  autoComplete="off"
                />

                <Button onClick={clickedBtn}>Submit</Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default FAQCreate;
