import { useState } from "react";
import {
  Page,
  Card,
  Layout,
  FormLayout,
  TextField,
  Form,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useRouter } from "next/router";

const FAQCreate = (props) => {
  const router = useRouter();
  const [titleValue, setTitleValue] = useState('');
  const handleTitleChange = (value) => setTitleValue(value);

  const [descriptionValue, setDescriptionValue] = useState('');
  const handleDescriptionChange = (value) => setDescriptionValue(value);

  const clickedNextBtn = () => {
    props.authAxios.post('/faq', {
      title: titleValue,
      description: descriptionValue,
      status: 'draft'
    })
    .then((response) => {
      console.log(response)
      router.push(`/faq/${response.data.data.id}/edit`)
    })
    .catch((error) => console.log(error))
  }
  const clickedBackBtn = () => router.back();
  return (
    <Page
      breadcrumbs={[{ content: "Back", onAction: () => clickedBackBtn() }]}
      title="Create FAQ"
      primaryAction={{ content: "Next", disabled: false, onAction: () => clickedNextBtn() }}
    >
      <TitleBar title="Create FAQ" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Form>
              <FormLayout>
                <TextField
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

              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default FAQCreate;
