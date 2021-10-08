import {
  Page,
  Card,
  Layout,
  EmptyState,
} from "@shopify/polaris";
import { Provider, TitleBar } from "@shopify/app-bridge-react";

const EmptyHome = (props) => {
    
  return (
    <Page
    // title="Orders"
    // primaryAction={{content: 'Create'}}
    // secondaryActions={[{content: 'Export'}]}
    // pagination={{
    //   hasNext: true,
    // }}
    >
      <TitleBar title="Homepage" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <EmptyState
              heading="Create New FAQ"
              action={{ content: "Create" }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              fullWidth
            >
              <p>
                You can create multiple FAQs and add questions and answers to
                each one.
              </p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default EmptyHome;
