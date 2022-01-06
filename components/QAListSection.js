import { useState, useCallback } from "react";
import {
  Card,
  DataTable,
  CalloutCard,
  Button
} from "@shopify/polaris";
import Link from 'next/link'
import { useRouter } from "next/router";


const QAListSection = (props) => {
  
  const [QAListLoaded, setQAListLoaded] = useState(props.qaData.length  >= 1);
  // console.log(props.qaData.length  >= 1)
  return <>{QAListLoaded ? <QAList faqEditId={props.faqEditId} qaData={props.qaData} /> : <EmptyList faqEditId={props.faqEditId} /> }</>;
};
const EmptyList = (props) => {
  const router = useRouter();
  return(
    <CalloutCard
          title="Add a New Question and Answer"
          illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
          primaryAction={{
            content: "ADD Q&A",
            onAction: () => router.push(`/faq/${props.faqEditId}/qa/new`)
          }}
        >
          <p>Add a question and answer that is popular</p>
        </CalloutCard>
  )
}
const QAList = (props) => {
  const router = useRouter();
  const [sortedRows, setSortedRows] = useState(null);
  console.log(props.qaData)
  const initiallySortedRows = props.qaData.map((item) => {
    return [<Link href={`/faq/${props.faqEditId}/qa/${item.id}/edit`}>
    <a>{item.title}</a>
  </Link>,
  100,
  `${item.created_at}`,
  `${item.updated_at}`
  ]
  })
  console.log(initiallySortedRows)
  // const initiallySortedRows = [
  //   [
  //     <Link href="/qa/edit/1">
  //       <a>How long does it take to learn Javascript?</a>
  //     </Link>,
  //     100,
  //     '12-04-2021',
  //     '12-04-2021',
  //   ],
  //   [
  //     <Link href="/qa/edit/1">
  //       <a>Node Version Manager - POSIX-compliant bash script to manage multiple active node.js versions?</a>
  //     </Link>,
  //     100,
  //     '12-04-2021',
  //     '12-04-2021',
  //   ],
    
  // ];

  const rows = sortedRows ? sortedRows : initiallySortedRows;
  const handleSort = useCallback(
    (index, direction) => setSortedRows(sortCurrency(rows, index, direction)),
    [rows],
  );
  const clickedCreateQA = () => {
    router.push(`/faq/${props.faqEditId}/qa/create`)
  }
  return(
    <Card title="Questions and Answers">
          <DataTable
            columnContentTypes={[
              "text",
              "numeric",
              "numeric",
              "numeric",
              "numeric",
            ]}
            headings={["Question", "Clicks", "Created", "Updated"]}
            rows={rows}
            sortable={[false, true, false, false, true]}
            defaultSortDirection="descending"
            initialSortColumnIndex={4}
            onSort={handleSort}
            footerContent={<Button primary onClick={clickedCreateQA}>Add Another QA</Button>}
          />
        </Card>
  )
}

export default QAListSection;
