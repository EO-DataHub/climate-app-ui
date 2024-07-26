import { PageTitle } from '../PageTitle'
import { PageLayout } from '../Layout/PageLayout'
import ReactMarkdown from 'react-markdown'

import pageContent from '../../configuration/informationPageContent.md'

export const Information = () => {
  return (
    <PageLayout>
      <PageTitle>Information</PageTitle>
      <ReactMarkdown>{pageContent}</ReactMarkdown>
    </PageLayout>
  )
}
