import { useEffect } from 'react';

import { KnowledgeBase } from '@/components/KnowledgeBase/KnowledgeBase';
import { useDocKnowledgeBase } from '@/context/DocKnowledgeBaseProvider';

export const KnowledgeBaseContainer = () => {
  // const [knowledgeBaseList, setKnowledgeBaseList] = useState<any[]>([]); // Add this line
  // const [loading, setLoading] = useState(false);
  const { setDocType } = useDocKnowledgeBase();
  useEffect(() => {
    setDocType('DOCUMENT');
  }, []);
  // const refetch = () => {
  //   setLoading(true);
  //   axios
  //     .post(
  //       'https://jfyktaessgkswrvkkg75b4gqdq0ftpbr.lambda-url.us-west-2.on.aws',
  //       {
  //         action: 'fetch',
  //         bucket_name: 'marmic-fire',
  //       },
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       if (response.data && response.data.length) {
  //         const temp: any[] = [];
  //         let tempObj = {};

  //         response.data.forEach((item: any, index: number) => {
  //           tempObj = {
  //             'File Name': item.Key,
  //             Size: item.Size,
  //             'Last Modified': new Date(item.LastModified).toLocaleString(),
  //           };
  //           temp.push(tempObj);
  //         });
  //         setKnowledgeBaseList(temp); // Add this line
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  // useEffect(() => {
  //   refetch();
  // }, []);
  return (
    <>
      <KnowledgeBase />
    </>
  );
};
