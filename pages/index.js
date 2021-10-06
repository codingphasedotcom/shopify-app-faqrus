import { Heading, Page, Card, Layout, FormLayout, TextField } from "@shopify/polaris";
import {Provider, TitleBar} from '@shopify/app-bridge-react';

const Index = (props) => {
  console.log(props);
  return (
    <Page
      title="Orders"
      primaryAction={{ content: "Create order" }}
      secondaryActions={[{ content: "Export" }]}
      pagination={{
        hasNext: true,
      }}
    >
      <TitleBar title="Homepage"/>
      <Layout>
        <Layout.Section>
          
          <Card title="Order details" sectioned>
            <Heading>Shopify apps with Node and React 🎉</Heading>
            <p>View a summary of your order.</p>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="Tags" sectioned>
            <p>Add tags to your order.</p>
          </Card>
        </Layout.Section>
      </Layout>
      <div style={{height: '100px'}}></div>
      <Layout>
        <Layout.AnnotatedSection
          id="storeDetails"
          title="Store details"
          description="Shopify and your customers will use this information to contact you."
        >
          <Card sectioned>
            <FormLayout>
              <TextField label="Store name" onChange={() => {}} autoComplete="off" />
              <TextField
                type="email"
                label="Account email"
                onChange={() => {}}
                autoComplete="email"
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
};

export default Index;
