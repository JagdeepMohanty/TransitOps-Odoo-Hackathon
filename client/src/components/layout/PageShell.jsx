import PageHeader from '@/components/layout/PageHeader'

export default function PageShell({ title, subtitle, actions, children }) {
  return (
    <div className="page-container">
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      {children}
    </div>
  )
}
