
import { useCallback, useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api/v1'

function App() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const [form, setForm] = useState({
    subject: '',
    description: '',
    customer_email: '',
    priority: 'medium',
    category: 'General',
  })

  const loadTickets = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/tickets`)

      if (!response.ok) {
        throw new Error(`Could not load tickets (${response.status})`)
      }

      const data = await response.json()
      setTickets(data)
    } catch (err) {
      setError(
        `${err.message}. Check that your FastAPI backend is running on port 8000.`,
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const navigateTo = (section, selectedFilter = filter) => {
    setFilter(selectedFilter)

    document.getElementById(section)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const createTicket = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const result = await response.json()
        const details = result.detail

        throw new Error(
          typeof details === 'string'
            ? details
            : JSON.stringify(details || result),
        )
      }

      setForm({
        subject: '',
        description: '',
        customer_email: '',
        priority: 'medium',
        category: 'General',
      })

      setShowForm(false)
      setFilter('all')
      setNotice('Ticket created successfully.')
      await loadTickets()

      document.getElementById('tickets')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (ticket) => {
    const nextStatus =
      ticket.status === 'resolved' ? 'open' : 'resolved'

    setError('')
    setNotice('')

    try {
      const response = await fetch(
        `${API_URL}/tickets/${ticket.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `Could not update ticket (${response.status}).`,
        )
      }

      setNotice(`Ticket #${ticket.id} marked ${nextStatus}.`)
      await loadTickets()
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredTickets =
    filter === 'all'
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter)

  const openCount = tickets.filter(
    (ticket) => ticket.status === 'open',
  ).length

  const progressCount = tickets.filter(
    (ticket) => ticket.status === 'in_progress',
  ).length

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === 'resolved',
  ).length

  const closedCount = tickets.filter(
    (ticket) => ticket.status === 'closed',
  ).length

  const filters = [
    { value: 'all', label: 'All tickets', count: tickets.length },
    { value: 'open', label: 'Open', count: openCount },
    {
      value: 'in_progress',
      label: 'In progress',
      count: progressCount,
    },
    { value: 'resolved', label: 'Resolved', count: resolvedCount },
    { value: 'closed', label: 'Closed', count: closedCount },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#dashboard"
          onClick={(event) => {
            event.preventDefault()
            navigateTo('dashboard', 'all')
          }}
        >
          <span className="brand-icon">S</span>
          <span>
            SupportPilot<span className="brand-ai"> AI</span>
          </span>
        </a>

        <p className="nav-label">WORKSPACE</p>

        <button
          type="button"
          className={`nav-item nav-button ${
            filter === 'all' ? 'active' : ''
          }`}
          onClick={() => navigateTo('dashboard', 'all')}
        >
          <span>▦</span>
          Overview
        </button>

        <button
          type="button"
          className={`nav-item nav-button ${
            filter !== 'all' ? 'active' : ''
          }`}
          onClick={() => navigateTo('tickets', 'all')}
        >
          <span>▤</span>
          All tickets
          <span className="nav-count">{tickets.length}</span>
        </button>

        <p className="nav-label nav-label-spaced">MANAGE</p>

        <button
          type="button"
          className="nav-item nav-button"
          onClick={() => setShowForm(true)}
        >
          <span>＋</span>
          Create ticket
        </button>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">✦</span>
            <strong>AI support assistant</strong>
            <p>
              Manage customer requests from one simple workspace.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">SP</div>
            <div>
              <strong>Support Team</strong>
              <span>Local workspace</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Overview
          </div>

          <div className="connection">
            <span className="connection-dot" />
            Support dashboard
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">
                CUSTOMER SUPPORT WORKSPACE
              </p>
              <h1>
                Good day, Support Team <span>✦</span>
              </h1>
              <p className="subtitle">
                Keep track of customer requests and stay on top of
                every ticket.
              </p>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              <span>＋</span> New ticket
            </button>
          </div>

          {error && (
            <div className="alert error-alert" role="alert">
              <strong>Something needs attention</strong>
              <p>{error}</p>
              <button type="button" onClick={loadTickets}>
                Try again
              </button>
            </div>
          )}

          {notice && (
            <div className="alert success-alert" role="status">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice('')}
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Total tickets</span>
                <span className="stat-icon purple">▤</span>
              </div>
              <strong>{loading ? '—' : tickets.length}</strong>
              <p>All customer requests</p>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Open tickets</span>
                <span className="stat-icon orange">◷</span>
              </div>
              <strong>{loading ? '—' : openCount}</strong>
              <p>Waiting for attention</p>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>In progress</span>
                <span className="stat-icon blue">↻</span>
              </div>
              <strong>{loading ? '—' : progressCount}</strong>
              <p>Currently being handled</p>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Resolved</span>
                <span className="stat-icon green">✓</span>
              </div>
              <strong>{loading ? '—' : resolvedCount}</strong>
              <p>Successfully resolved</p>
            </article>
          </div>

          <section className="ticket-panel" id="tickets">
            <div className="panel-heading">
              <div>
                <h2>Customer tickets</h2>
                <p>
                  Review and manage incoming support requests.
                </p>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={loadTickets}
                disabled={loading}
              >
                ↻ Refresh
              </button>
            </div>

            <div className="ticket-toolbar">
              <div className="filter-tabs">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={
                      filter === item.value
                        ? 'filter-tab selected'
                        : 'filter-tab'
                    }
                    aria-pressed={filter === item.value}
                    onClick={() => setFilter(item.value)}
                  >
                    {item.label}
                    <span className="filter-count">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              <span className="result-count">
                {filteredTickets.length} tickets
              </span>
            </div>

            <div className="ticket-table-wrap">
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th>SUBJECT</th>
                    <th>CUSTOMER</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th>CREATED</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        Loading tickets...
                      </td>
                    </tr>
                  ) : filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <span className="empty-icon">▤</span>
                        <strong>
                          {filter === 'all'
                            ? 'No tickets yet'
                            : `No ${filter.replace('_', ' ')} tickets`}
                        </strong>
                        <p>
                          {filter === 'all'
                            ? 'Create a ticket to see it in your workspace.'
                            : 'Try another status filter or create a ticket.'}
                        </p>
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => setShowForm(true)}
                        >
                          ＋ Create ticket
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>
                          <div className="subject-cell">
                            <span className="ticket-id">
                              #{String(ticket.id).padStart(4, '0')}
                            </span>
                            <strong>{ticket.subject}</strong>
                            <span className="ticket-category">
                              {ticket.category || 'Uncategorized'}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="customer-cell">
                            <span className="customer-avatar">
                              {(ticket.customer_email || '?')[0].toUpperCase()}
                            </span>
                            <span>{ticket.customer_email}</span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`priority priority-${ticket.priority}`}
                          >
                            <span />
                            {ticket.priority}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status status-${ticket.status}`}
                          >
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="date-cell">
                          {new Date(
                            ticket.created_at,
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="action-button"
                            onClick={() => updateStatus(ticket)}
                            disabled={ticket.status === 'closed'}
                            title={
                              ticket.status === 'resolved'
                                ? 'Reopen ticket'
                                : 'Mark as resolved'
                            }
                          >
                            {ticket.status === 'closed'
                              ? 'Closed'
                              : ticket.status === 'resolved'
                                ? 'Reopen'
                                : 'Resolve'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="page-footer">
            <span>SupportPilot AI</span>
            <span>Customer support, made clearer.</span>
          </footer>
        </section>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false)
            }
          }}
        >
          <section
            className="ticket-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-modal-title"
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">CUSTOMER SUPPORT</p>
                <h2 id="ticket-modal-title">Create a ticket</h2>
                <p>Add the details for this customer request.</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={createTicket}>
              <label>
                Subject
                <input
                  required
                  minLength={3}
                  maxLength={200}
                  value={form.subject}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      subject: event.target.value,
                    })
                  }
                  placeholder="e.g. Unable to log in"
                />
              </label>

              <label>
                Customer email
                <input
                  required
                  type="email"
                  maxLength={255}
                  value={form.customer_email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      customer_email: event.target.value,
                    })
                  }
                  placeholder="customer@example.com"
                />
              </label>

              <label>
                Description
                <textarea
                  required
                  maxLength={10000}
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe the customer's issue..."
                />
              </label>

              <div className="form-row">
                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        priority: event.target.value,
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </label>

                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value,
                      })
                    }
                  >
                    <option value="General">General</option>
                    <option value="Account">Account</option>
                    <option value="Billing">Billing</option>
                    <option value="Technical">Technical</option>
                    <option value="Product">Product</option>
                    <option value="Shipping">Shipping</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? 'Creating...' : 'Create ticket'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
