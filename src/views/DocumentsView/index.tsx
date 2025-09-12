'use client';

import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";

import UploadForm from "./UploadForm";
import VerifyForm from "./VerifyForm";

type DocumentViewState = 'upload' | 'verify';

const DocumentsView: FC = () => {

  const tabs: {
    value: DocumentViewState;
    labelComponent: string | React.ReactNode;
    content: React.ReactNode;
  }[] = [
    {
      value: 'upload',
      labelComponent: 'Upload',
      content: <UploadForm />
    },
    {
      value: 'verify',
      labelComponent: 'Verify',
      content: <VerifyForm />
    }
  ]

  return (
    <div>
      <Tabs>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.labelComponent}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default DocumentsView;