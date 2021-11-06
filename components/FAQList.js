import { useState, useCallback } from "react";
import {
  Page,
  Card,
  Layout,
  EmptyState,
  DataTable
} from "@shopify/polaris";
import { Provider, TitleBar } from "@shopify/app-bridge-react";
import { useRouter } from "next/router";
import Link from 'next/link'

const FAQList = (props) => {
  const router = useRouter();
  const [sortedRows, setSortedRows] = useState(null);
  
  const clickedCreateBtn = () => {
    router.push('/faq/create')
  }

  
  const initiallySortedRows = props.FAQData.map((item) => {
    return [
      <Link
        href={`/faq/${item.id}/edit`}
        key={`${item.slug}`}
      >
        {item.title}
      </Link>,
      (item.status) ? 'Dynamic' : 'fixed',
      `${item.created_at}`,
      `${item.updated_at}`,
    ]
  })


  const rows = sortedRows ? sortedRows : initiallySortedRows;
  const handleSort = useCallback(
    (index, direction) => setSortedRows(sortCurrency(rows, index, direction)),
    [rows],
  );
  return (
    <Page
    title="All FAQs"
    primaryAction={{content: 'Create', onAction: () => clickedCreateBtn() }}
    // secondaryActions={[{content: 'Export'}]}
    pagination={{
      hasNext: true,
    }}
    >
      <TitleBar title="Homepage" />
      <Layout>
          <Layout.Section>
            <Card>
            <DataTable
          columnContentTypes={[
            'text',
            'numeric',
            'numeric',
            'numeric',
            'numeric',
          ]}
          headings={[
            'Title',
            'Type',
            'Created',
            'Updated',
          ]}
          rows={rows}
          sortable={[false, true, false, false, true]}
          defaultSortDirection="descending"
          initialSortColumnIndex={4}
          onSort={handleSort}
          footerContent={`Showing ${rows.length} of ${rows.length} results`}
        />
            </Card>
          </Layout.Section>
        </Layout>
    </Page>
  );
};

export default FAQList;
