type RequestsHeaderProps = {
  count: number
  isAdmin?: boolean
}

const RequestsHeader = ({ count, isAdmin = false }: RequestsHeaderProps) => (
  <div className="flex items-end justify-between px-1">
    <div className="text-left">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b08238]">
        {isAdmin ? "Admin" : "My"}
      </p>
      <h3 className="mt-1 text-left text-xl font-black tracking-normal uppercase text-[#251d17]">
        {isAdmin ? "Pending Requests" : "My Requests"}
      </h3>
    </div>
    <span className="text-xs text-[#8b7a65]">
      {count} {isAdmin ? "pending" : "items"}
    </span>
  </div>
)

export default RequestsHeader
