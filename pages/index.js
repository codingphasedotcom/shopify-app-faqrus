import { useState, useEffect } from "react";
import { Provider, TitleBar } from "@shopify/app-bridge-react";
import EmptyHome from "../components/EmptyHome";
import FAQList from "../components/FAQList";
import { useRouter } from "next/router";

const Index = (props) => {
  const router = useRouter();

  useEffect(() => {
    props.authAxios
      .get(`/faq`)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
        // router.push(`/`)
      });
  }, []);

  return (
    <>
      {/* <EmptyHome /> */}
      <FAQList />
    </>
  );
};

export default Index;
