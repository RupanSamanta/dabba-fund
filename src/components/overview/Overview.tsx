import ContributionList from "./ContributionList"
import { defaultContributors } from "@/data/contributors"

const Overview = () => {
  return (
    <ContributionList contributors={defaultContributors} />
  )
}

export default Overview