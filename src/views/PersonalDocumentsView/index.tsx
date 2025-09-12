import DocumentsList from "./components/DocumentsList";

const PersonalDocumentsView = () => {

  return (
    <div>
      <DocumentsList data={[]} maxCards={20} />
    </div>
  )
}

export default PersonalDocumentsView;