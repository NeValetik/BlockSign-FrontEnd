'use client';

import { FC } from "react";
// import { useUserContext } from "@/contexts/userContext";

// import UploadForm from "../PersonalDocumentsView/UploadForm";
import VerifyForm from "./VerifyForm";

// type DocumentViewState = 'upload' | 'verify';

const DocumentsView: FC = () => {

  // const { me } = useUserContext();
  // const tabs: {
  //   value: DocumentViewState;
  //   labelComponent: string | React.ReactNode;
  //   content: React.ReactNode;
  //   isAuthorizedAccess?: boolean;
  // }[] = [
  //   {
  //     value: 'verify',
  //     labelComponent: 'Verify',
  //     content: <VerifyForm />
  //   },
  //   // {
  //   //   value: 'upload',
  //   //   labelComponent: 'Upload',
  //   //   isAuthorizedAccess: true,
  //   //   content: <UploadForm />
  //   // },
  // ]

  return (
    <div>
      <VerifyForm />
      {/* <Tabs
        defaultValue={tabs[1].value}
        className="gap-20"
      >
        <TabsList
          className="w-full gap-2 bg-brand"
        > */}
          {/* {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="text-brand-foreground data-[state=active]:text-muted-foreground cursor-pointer"
              disabled={!me && tab.isAuthorizedAccess}
            >
              {tab.labelComponent}
            </TabsTrigger>
          ))} */}
        {/* </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs> */}
    </div>
  );
}

export default DocumentsView;