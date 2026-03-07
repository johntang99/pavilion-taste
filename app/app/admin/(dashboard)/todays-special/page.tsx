import { getSites } from '@/lib/sites';
import { MenuCurationManager } from '@/components/admin/MenuCurationManager';
import { getSession } from '@/lib/admin/auth';
import { filterSitesForUser } from '@/lib/admin/permissions';

export default async function AdminTodaysSpecialPage({
  searchParams,
}: {
  searchParams?: { siteId?: string; locale?: string };
}) {
  const session = await getSession();
  const sites = await getSites();
  const visibleSites = session ? filterSitesForUser(sites, session.user) : sites;
  const defaultSite = visibleSites[0];
  const requestedSiteId = searchParams?.siteId || '';
  const selectedSite =
    visibleSites.find((site) => site.id === requestedSiteId) || defaultSite;
  const selectedSiteId = selectedSite?.id || '';

  return <MenuCurationManager siteId={selectedSiteId} mode="daily" />;
}
