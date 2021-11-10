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

const QACreatePage = (props) => {
  const router = useRouter();
  const [titleValue, setTitleValue] = useState('');
  const handleTitleChange = (value) => setTitleValue(value);

  const [answerValue, setAnswerValue] = useState('');
  const handleAnswerChange = (value) => setAnswerValue(value);

  const clickedNextBtn = () => {
    props.authAxios.post(`/faq/${props.faqEditId}/qa`, {
      title: titleValue,
      answer: answerValue
    })
    .then((response) => {
      console.log(response)
      router.push(`/faq/${props.faqEditId}/edit`)
    })
    .catch((error) => console.log(error))
  }
  const clickedBackBtn = () => router.back();
  return (
    <Page
      breadcrumbs={[{ content: "Back", onAction: () => clickedBackBtn() }]}
      title="Create Question and Answer"
      primaryAction={{ content: "Next", disabled: false, onAction: () => clickedNextBtn() }}
    >
      <TitleBar title="Create Question and Answer" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Form>
              <FormLayout>
                <TextField
                  onChange={handleTitleChange}
                  label="Question"
                  type="text"
                  value={titleValue}
                  helpText={
                    <span>
                      Add question that you will answer
                    </span>
                  }
                />
                <TextField
                  label="Answer"
                  value={answerValue}
                  onChange={handleAnswerChange}
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


QACreatePage.getInitialProps = async (ctx) => {
  return { faqEditId: ctx.query.faqEditId };
};

export default QACreatePage;
