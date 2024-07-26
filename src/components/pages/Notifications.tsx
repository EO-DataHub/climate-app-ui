import { PageTitle } from '../PageTitle'
import { PageLayout } from '../Layout/PageLayout'
import ReactMarkdown from 'react-markdown'

import pageContent from '../../configuration/notificationsPageContent.md'

export const Notifications = () => {
  return (
    <PageLayout>
      <PageTitle>Notifications</PageTitle>
      <ReactMarkdown>{pageContent}</ReactMarkdown>
    </PageLayout>
  )
}
