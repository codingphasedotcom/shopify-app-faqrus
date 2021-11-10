import { useState, useEffect } from "react";
import {
  Page,
  Card,
  Layout,
  FormLayout,
  TextField,
  Form,
  Button,
  Select,
  Toast,
  Frame,
  Modal
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import QAListSection from "../../../components/QAListSection";
import { useRouter } from "next/router";

const FAQEditPage = (props) => {
  const router = useRouter();
  const { faqEditId } = props;

  const [titleValue, setTitleValue] = useState("");
  const handleTitleChange = (value) => setTitleValue(value);
  const [descriptionValue, setDescriptionValue] = useState("");
  const handleDescriptionChange = (value) => setDescriptionValue(value);
  const [statusValue, setStatusValue] = useState("draft");
  const handleStatusChange = (value) => setStatusValue(value);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    props.authAxios
      .get(`/faq/${faqEditId}`)
      .then((response) => {
        setTitleValue(response.data.data.title);
        setDescriptionValue(response.data.data.description);
        setStatusValue(response.data.data.status);
      })
      .catch((error) => {
        console.log(error)
        router.push(`/`)
      });
  }, []);

  const clickedNextBtn = () => {
    console.log("clicked next button");
    props.authAxios
      .put(`/faq/${faqEditId}`, {
        title: titleValue,
        description: descriptionValue,
        status: statusValue,
      })
      .then((response) => {
        console.log(response);
        setShowToast(!showToast);
        console.log(showToast);
        // router.push(`/faq/${response.data.data.id}/edit`)
      })
      .catch((error) => console.log(error));
  };

  const toastMarkup = showToast ? (
    <Toast content="FAQ Updated" onDismiss={() => setShowToast(!showToast)} />
  ) : null;

  const clickedBackBtn = () => router.push("/");
  
  const deleteFAQAction = () => {
    props.authAxios
      .delete(`/faq/${faqEditId}`)
      .then((response) => {
        // console.log(response);
        // setShowToast(!showToast);
        // console.log(showToast);
        router.push(`/`)
      })
      .catch((error) => console.log(error));
  }

  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <Frame>
      <Page
        breadcrumbs={[{ content: "Back", onAction: () => clickedBackBtn() }]}
        title="Edit FAQ"
        primaryAction={{
          content: "Save",
          disabled: false,
          onAction: () => clickedNextBtn(),
        }}
        secondaryActions={[{
          content: "Delete",
          onAction: () => setShowDeleteModal(!showDeleteModal),
        }]}
      >
        <TitleBar title="Edit FAQ" />

        <Layout>
          {toastMarkup}
          <Modal
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(!showDeleteModal)}
            title="Are you sure you want to delete this FAQ?"
            primaryAction={{
              content: "Yes, I'm sure!",
              onAction: deleteFAQAction,
            }}
            secondaryActions={[
              {
                content: "No, Don't Delete",
                onAction: () => setShowDeleteModal(!showDeleteModal),
              },
            ]}
          >
            
          </Modal>
          <Layout.Section>
            <Card title="FAQ INFO" sectioned>
              <Form>
                <FormLayout>
                  <TextField
                    value={titleValue}
                    onChange={handleTitleChange}
                    label="Title"
                    type="text"
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

            <QAListSection faqEditId={props.faqEditId} />
          </Layout.Section>
          <Layout.Section secondary>
            <Card title="Status" sectioned>
              <Select
                options={[
                  { label: "Active", value: "active" },
                  { label: "Draft", value: "draft" },
                ]}
                onChange={handleStatusChange}
                value={statusValue}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
};

FAQEditPage.getInitialProps = async (ctx) => {
  return { faqEditId: ctx.query.faqEditId };
};

export default FAQEditPage;
