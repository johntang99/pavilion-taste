import { getSites } from '@/lib/sites';
import { MenuDatabaseEditor } from '@/components/admin/MenuDatabaseEditor';
import { getSession } from '@/lib/admin/auth';
import { filterSitesForUser } from '@/lib/admin/permissions';

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams?: { siteId?: string; locale?: string; file?: string };
}) {
  const session = await getSession();
  const sites = await getSites();
  const visibleSites = session ? filterSitesForUser(sites, session.user) : sites;
  const defaultSite = visibleSites[0];
  const requestedSiteId = searchParams?.siteId || '';
  const selectedSite =
    visibleSites.find((site) => site.id === requestedSiteId) || defaultSite;
  const selectedSiteId = selectedSite?.id || '';

  return <MenuDatabaseEditor siteId={selectedSiteId} />;
}
