import { PageTitle } from '../PageTitle'
import { PageLayout } from '../Layout/PageLayout'
import ReactMarkdown from 'react-markdown'

import pageContent from '../../configuration/portfolioPageContent.md'

export const Portfolios = () => {
  return (
    <PageLayout>
      <PageTitle>Portfolios</PageTitle>
      <ReactMarkdown>{pageContent}</ReactMarkdown>
    </PageLayout>
  )
}
