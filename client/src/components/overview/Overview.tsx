import ContributionList from "./ContributionList"
import { defaultContributors } from "@/data/contributors"

type OverviewProps = {
  currentContributorId: string | null
}

const Overview = ({ currentContributorId }: OverviewProps) => {
  return (
    <ContributionList contributors={defaultContributors} currentContributorId={currentContributorId} />
  )
}

export default Overview
