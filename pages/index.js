import { useState, useEffect } from "react";
import { Provider, TitleBar } from "@shopify/app-bridge-react";
import { Spinner } from  '@shopify/polaris';
import EmptyHome from "../components/EmptyHome";
import FAQList from "../components/FAQList";
import { useRouter } from "next/router";

const Index = (props) => {
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(true);
  const [FAQData, setFAQData] = useState([]);

  useEffect(() => {
    props.authAxios
      .get(`/faq`)
      .then((response) => {
        setFAQData(response.data.data)
        setLoadingData(false)
      })
      .catch((error) => {
        console.log(error)
        // router.push(`/`)
      });
  }, []);

  return (
    <>
      {
        loadingData ? (
          <div style={{
            display: "flex",
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px'
          }}>
            <Spinner accessibilityLabel="loading data" size="large" />
          </div>
        ) : FAQData.length <= 0 ? (
          <EmptyHome />
        ) : (
          <FAQList FAQData={FAQData} /> 
        )
      }
    </>
  );
};

export default Index;
