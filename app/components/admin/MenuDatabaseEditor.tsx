'use client';

import { useEffect, useMemo, useState } from 'react';
import { ImagePickerModal } from '@/components/admin/ImagePickerModal';

interface MenuCategoryRow {
  id: string;
  site_id: string;
  name: string;
  name_zh: string;
  slug: string;
  description?: string | null;
  description_zh?: string | null;
  menu_type: string;
  is_active: boolean;
  sort_order: number;
}

interface MenuItemRow {
  id: string;
  site_id: string;
  menu_category_id: string | null;
  name: string;
  name_zh: string;
  slug: string;
  description?: string | null;
  description_zh?: string | null;
  price?: number | null;
  image?: string | null;
  is_available: boolean;
  is_chef_signature: boolean;
  sort_order: number;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function MenuDatabaseEditor({ siteId }: { siteId: string }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [categories, setCategories] = useState<MenuCategoryRow[]>([]);
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [selectedMenuType, setSelectedMenuType] = useState('dim-sum');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categoryDrafts, setCategoryDrafts] = useState<Record<string, Partial<MenuCategoryRow>>>({});
  const [itemDrafts, setItemDrafts] = useState<Record<string, Partial<MenuItemRow>>>({});
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [newMenuType, setNewMenuType] = useState('');
  const [showDeleteTypeModal, setShowDeleteTypeModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageTargetItemId, setImageTargetItemId] = useState<string | null>(null);

  const loadData = async (preferCategoryId?: string) => {
    if (!siteId) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/admin/menu/editor?siteId=${encodeURIComponent(siteId)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Failed to load menu data');

      const nextCategories = (payload.categories || []) as MenuCategoryRow[];
      const nextItems = (payload.items || []) as MenuItemRow[];
      setCategories(nextCategories);
      setItems(nextItems);

      const categoryDraftMap: Record<string, Partial<MenuCategoryRow>> = {};
      nextCategories.forEach((row) => {
        categoryDraftMap[row.id] = {
          name: row.name,
          name_zh: row.name_zh,
          slug: row.slug,
          description: row.description || '',
          description_zh: row.description_zh || '',
          menu_type: row.menu_type,
          sort_order: row.sort_order,
          is_active: row.is_active,
        };
      });
      setCategoryDrafts(categoryDraftMap);

      const itemDraftMap: Record<string, Partial<MenuItemRow>> = {};
      nextItems.forEach((row) => {
        itemDraftMap[row.id] = {
          name: row.name,
          name_zh: row.name_zh,
          slug: row.slug,
          description: row.description || '',
          description_zh: row.description_zh || '',
          price: row.price ?? null,
          image: row.image || '',
          sort_order: row.sort_order,
          is_available: row.is_available,
          is_chef_signature: row.is_chef_signature,
        };
      });
      setItemDrafts(itemDraftMap);

      const uniqueTypes = Array.from(new Set(nextCategories.map((c) => c.menu_type)));
      if (!uniqueTypes.includes(selectedMenuType)) {
        setSelectedMenuType(uniqueTypes[0] || 'dim-sum');
      }

      const visibleCategoryIds = nextCategories
        .filter((c) => c.menu_type === (uniqueTypes.includes(selectedMenuType) ? selectedMenuType : uniqueTypes[0]))
        .map((c) => c.id);
      const nextSelected =
        preferCategoryId && visibleCategoryIds.includes(preferCategoryId)
          ? preferCategoryId
          : visibleCategoryIds.includes(selectedCategoryId)
            ? selectedCategoryId
            : visibleCategoryIds[0] || '';
      setSelectedCategoryId(nextSelected);
    } catch (error: any) {
      setStatus(error?.message || 'Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [siteId]);

  const menuTypes = useMemo(() => {
    const set = new Set(categories.map((c) => c.menu_type).filter(Boolean));
    const typedMenuType = slugify(newMenuType);
    if (typedMenuType) set.add(typedMenuType);
    return Array.from(set.values());
  }, [categories, newMenuType]);

  const filteredCategories = useMemo(
    () =>
      categories
        .filter((c) => c.menu_type === selectedMenuType)
        .sort((a, b) => a.sort_order - b.sort_order),
    [categories, selectedMenuType]
  );

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  const categoryItems = useMemo(
    () =>
      items
        .filter((i) => i.menu_category_id === selectedCategoryId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [items, selectedCategoryId]
  );

  useEffect(() => {
    if (menuTypes.length === 0) {
      setSelectedMenuType('');
      setSelectedCategoryId('');
      return;
    }
    if (!menuTypes.includes(selectedMenuType)) {
      setSelectedMenuType(menuTypes[0]);
      return;
    }
    const categoriesInType = categories
      .filter((c) => c.menu_type === selectedMenuType)
      .sort((a, b) => a.sort_order - b.sort_order);
    if (!categoriesInType.some((c) => c.id === selectedCategoryId)) {
      setSelectedCategoryId(categoriesInType[0]?.id || '');
    }
  }, [menuTypes, selectedMenuType, selectedCategoryId, categories]);

  const selectedTypeCategories = useMemo(
    () => categories.filter((c) => c.menu_type === selectedMenuType),
    [categories, selectedMenuType]
  );
  const selectedTypeCategoryIds = useMemo(
    () => new Set(selectedTypeCategories.map((c) => c.id)),
    [selectedTypeCategories]
  );
  const selectedTypeItemCount = useMemo(
    () => items.filter((item) => item.menu_category_id && selectedTypeCategoryIds.has(item.menu_category_id)).length,
    [items, selectedTypeCategoryIds]
  );

  const callAction = async (action: string, body: Record<string, unknown>) => {
    const response = await fetch('/api/admin/menu/editor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        action,
        ...body,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || `Failed action: ${action}`);
    }
    return payload;
  };

  const createCategory = async () => {
    const menuType = slugify(newMenuType) || selectedMenuType || 'dinner';
    setPendingKey('create-category');
    setStatus(null);
    try {
      await callAction('createCategory', {
        menuType,
        name: 'New Category',
        nameZh: '新分类',
        slug: `new-category-${Date.now().toString().slice(-4)}`,
        sortOrder: filteredCategories.length + 1,
        isActive: true,
      });
      setSelectedMenuType(menuType);
      setNewMenuType('');
      await loadData();
      setStatus('Category created.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to create category');
    } finally {
      setPendingKey(null);
    }
  };

  const createCategoryForMenuType = async (menuTypeInput: string) => {
    const menuType = slugify(menuTypeInput);
    if (!menuType) {
      setStatus('Enter a menu type first.');
      return;
    }
    setPendingKey('create-menu-type');
    setStatus(null);
    try {
      await callAction('createCategory', {
        menuType,
        name: 'New Category',
        nameZh: '新分类',
        slug: `new-category-${Date.now().toString().slice(-4)}`,
        sortOrder: 1,
        isActive: true,
      });
      setSelectedMenuType(menuType);
      setNewMenuType('');
      await loadData();
      setStatus(`Menu type "${menuType}" created with first category.`);
    } catch (error: any) {
      setStatus(error?.message || 'Failed to create menu type');
    } finally {
      setPendingKey(null);
    }
  };

  const deleteSelectedMenuType = async () => {
    if (!selectedMenuType) return;
    setPendingKey('delete-menu-type');
    setStatus(null);
    try {
      await callAction('deleteMenuType', { menuType: selectedMenuType });
      setShowDeleteTypeModal(false);
      await loadData();
      setStatus(`Menu type "${selectedMenuType}" deleted.`);
    } catch (error: any) {
      setStatus(error?.message || 'Failed to delete menu type');
    } finally {
      setPendingKey(null);
    }
  };

  const saveCategory = async (categoryId: string) => {
    const draft = categoryDrafts[categoryId];
    if (!draft) return;
    setPendingKey(`save-category-${categoryId}`);
    setStatus(null);
    try {
      await callAction('updateCategory', {
        categoryId,
        name: draft.name,
        nameZh: draft.name_zh,
        slug: draft.slug || slugify(String(draft.name || '')),
        description: draft.description,
        descriptionZh: draft.description_zh,
        menuType: draft.menu_type || selectedMenuType,
        sortOrder: Number(draft.sort_order ?? 0),
        isActive: draft.is_active !== false,
      });
      await loadData(categoryId);
      setStatus('Category saved.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to save category');
    } finally {
      setPendingKey(null);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm('Delete this category? It must have no items.');
    if (!confirmed) return;
    setPendingKey(`delete-category-${categoryId}`);
    setStatus(null);
    try {
      await callAction('deleteCategory', { categoryId });
      await loadData();
      setStatus('Category deleted.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to delete category');
    } finally {
      setPendingKey(null);
    }
  };

  const createItem = async () => {
    if (!selectedCategoryId) return;
    setPendingKey('create-item');
    setStatus(null);
    try {
      await callAction('createItem', {
        categoryId: selectedCategoryId,
        name: 'New Dish',
        nameZh: '新菜品',
        slug: `new-dish-${Date.now().toString().slice(-4)}`,
        sortOrder: categoryItems.length + 1,
        isAvailable: true,
      });
      await loadData(selectedCategoryId);
      setStatus('Menu item created.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to create menu item');
    } finally {
      setPendingKey(null);
    }
  };

  const saveItem = async (itemId: string) => {
    const draft = itemDrafts[itemId];
    if (!draft) return;
    setPendingKey(`save-item-${itemId}`);
    setStatus(null);
    try {
      await callAction('updateItem', {
        itemId,
        categoryId: selectedCategoryId,
        name: draft.name,
        nameZh: draft.name_zh,
        slug: draft.slug || slugify(String(draft.name || '')),
        description: draft.description,
        descriptionZh: draft.description_zh,
        price: draft.price ?? null,
        image: draft.image,
        sortOrder: Number(draft.sort_order ?? 0),
        isAvailable: draft.is_available !== false,
        isChefSignature: Boolean(draft.is_chef_signature),
      });
      await loadData(selectedCategoryId);
      setStatus('Menu item saved.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to save menu item');
    } finally {
      setPendingKey(null);
    }
  };

  const deleteItem = async (itemId: string) => {
    const confirmed = window.confirm('Delete this menu item?');
    if (!confirmed) return;
    setPendingKey(`delete-item-${itemId}`);
    setStatus(null);
    try {
      await callAction('deleteItem', { itemId });
      await loadData(selectedCategoryId);
      setStatus('Menu item deleted.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to delete menu item');
    } finally {
      setPendingKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h1 className="text-xl font-semibold text-gray-900">Menu Manager</h1>
        <p className="mt-1 text-sm text-gray-600">
          Meridian-style editor: menu types → categories → category + items editor.
        </p>
      </div>

      {status && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {status}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[220px_300px_minmax(0,1fr)]">
        <section className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Menu Types
          </div>
          <div className="mb-3 space-y-2 rounded-md border border-gray-100 p-2">
            <input
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs"
              placeholder="New menu type (e.g. weekend-brunch)"
              value={newMenuType}
              onChange={(event) => setNewMenuType(event.target.value)}
            />
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => createCategoryForMenuType(newMenuType)}
                disabled={pendingKey === 'create-menu-type'}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
              >
                Create Type
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewMenuType('weekend-brunch');
                  void createCategoryForMenuType('weekend-brunch');
                }}
                disabled={pendingKey === 'create-menu-type'}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
              >
                + weekend-brunch
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewMenuType('seasonal');
                  void createCategoryForMenuType('seasonal');
                }}
                disabled={pendingKey === 'create-menu-type'}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
              >
                + seasonal
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteTypeModal(true)}
                disabled={!selectedMenuType || pendingKey === 'delete-menu-type'}
                className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Delete Type
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {menuTypes.map((type) => {
              const count = categories.filter((c) => c.menu_type === type).length;
              const active = selectedMenuType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedMenuType(type);
                    const first = categories.find((c) => c.menu_type === type);
                    setSelectedCategoryId(first?.id || '');
                  }}
                  className={`w-full rounded-md px-2 py-2 text-left text-sm ${
                    active ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div>{type}</div>
                  <div className="text-xs text-gray-500">{count} categories</div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Categories
            </div>
            <button
              type="button"
              onClick={createCategory}
              disabled={pendingKey === 'create-category'}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <div className="space-y-1">
            {filteredCategories.map((category) => {
              const active = category.id === selectedCategoryId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`w-full rounded-md px-2 py-2 text-left text-sm ${
                    active ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div>{category.name_zh || category.name}</div>
                  <div className="text-xs text-gray-500">{category.name}</div>
                </button>
              );
            })}
            {!loading && filteredCategories.length === 0 && (
              <div className="rounded-md border border-dashed border-gray-200 px-2 py-3 text-xs text-gray-500">
                No categories in this menu type yet. Click Add to create one.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading menu data...</div>
          ) : !selectedCategory ? (
            <div className="text-sm text-gray-500">Select a category to edit.</div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 p-3">
                <div className="mb-3 text-sm font-semibold text-gray-900">Category Editor</div>
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Name (EN)"
                    value={String(categoryDrafts[selectedCategory.id]?.name ?? '')}
                    onChange={(event) =>
                      setCategoryDrafts((current) => ({
                        ...current,
                        [selectedCategory.id]: {
                          ...current[selectedCategory.id],
                          name: event.target.value,
                        },
                      }))
                    }
                  />
                  <input
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Name (ZH)"
                    value={String(categoryDrafts[selectedCategory.id]?.name_zh ?? '')}
                    onChange={(event) =>
                      setCategoryDrafts((current) => ({
                        ...current,
                        [selectedCategory.id]: {
                          ...current[selectedCategory.id],
                          name_zh: event.target.value,
                        },
                      }))
                    }
                  />
                  <input
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Slug"
                    value={String(categoryDrafts[selectedCategory.id]?.slug ?? '')}
                    onChange={(event) =>
                      setCategoryDrafts((current) => ({
                        ...current,
                        [selectedCategory.id]: {
                          ...current[selectedCategory.id],
                          slug: slugify(event.target.value),
                        },
                      }))
                    }
                  />
                  <input
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Menu Type"
                    value={String(categoryDrafts[selectedCategory.id]?.menu_type ?? '')}
                    onChange={(event) =>
                      setCategoryDrafts((current) => ({
                        ...current,
                        [selectedCategory.id]: {
                          ...current[selectedCategory.id],
                          menu_type: slugify(event.target.value),
                        },
                      }))
                    }
                  />
                  <input
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Sort Order"
                    type="number"
                    value={Number(categoryDrafts[selectedCategory.id]?.sort_order ?? 0)}
                    onChange={(event) =>
                      setCategoryDrafts((current) => ({
                        ...current,
                        [selectedCategory.id]: {
                          ...current[selectedCategory.id],
                          sort_order: Number(event.target.value || 0),
                        },
                      }))
                    }
                  />
                  <label className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={categoryDrafts[selectedCategory.id]?.is_active !== false}
                      onChange={(event) =>
                        setCategoryDrafts((current) => ({
                          ...current,
                          [selectedCategory.id]: {
                            ...current[selectedCategory.id],
                            is_active: event.target.checked,
                          },
                        }))
                      }
                    />
                    Active
                  </label>
                  <textarea
                    className="md:col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Description (EN)"
                    value={String(categoryDrafts[selectedCategory.id]?.description ?? '')}
                    onChange={(event) =>
                      setCategoryDrafts((current) => ({
                        ...current,
                        [selectedCategory.id]: {
                          ...current[selectedCategory.id],
                          description: event.target.value,
                        },
                      }))
                    }
                  />
                  <textarea
                    className="md:col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Description (ZH)"
                    value={String(categoryDrafts[selectedCategory.id]?.description_zh ?? '')}
                    onChange={(event) =>
                      setCategoryDrafts((current) => ({
                        ...current,
                        [selectedCategory.id]: {
                          ...current[selectedCategory.id],
                          description_zh: event.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => saveCategory(selectedCategory.id)}
                    disabled={pendingKey === `save-category-${selectedCategory.id}`}
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    Save Category
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(selectedCategory.id)}
                    disabled={pendingKey === `delete-category-${selectedCategory.id}`}
                    className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete Category
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">Category Items</div>
                  <button
                    type="button"
                    onClick={createItem}
                    disabled={!selectedCategoryId || pendingKey === 'create-item'}
                    className="rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                  >
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="rounded-md border border-gray-200 p-3">
                      <div className="grid gap-2 md:grid-cols-2">
                        <input
                          className="rounded-md border border-gray-300 px-2 py-2 text-sm"
                          placeholder="Name (EN)"
                          value={String(itemDrafts[item.id]?.name ?? '')}
                          onChange={(event) =>
                            setItemDrafts((current) => ({
                              ...current,
                              [item.id]: { ...current[item.id], name: event.target.value },
                            }))
                          }
                        />
                        <input
                          className="rounded-md border border-gray-300 px-2 py-2 text-sm"
                          placeholder="Name (ZH)"
                          value={String(itemDrafts[item.id]?.name_zh ?? '')}
                          onChange={(event) =>
                            setItemDrafts((current) => ({
                              ...current,
                              [item.id]: { ...current[item.id], name_zh: event.target.value },
                            }))
                          }
                        />
                        <input
                          className="rounded-md border border-gray-300 px-2 py-2 text-sm"
                          placeholder="Slug"
                          value={String(itemDrafts[item.id]?.slug ?? '')}
                          onChange={(event) =>
                            setItemDrafts((current) => ({
                              ...current,
                              [item.id]: { ...current[item.id], slug: slugify(event.target.value) },
                            }))
                          }
                        />
                        <input
                          className="rounded-md border border-gray-300 px-2 py-2 text-sm"
                          placeholder="Price (cents)"
                          type="number"
                          value={itemDrafts[item.id]?.price ?? ''}
                          onChange={(event) =>
                            setItemDrafts((current) => ({
                              ...current,
                              [item.id]: {
                                ...current[item.id],
                                price: event.target.value === '' ? null : Number(event.target.value),
                              },
                            }))
                          }
                        />
                        <textarea
                          className="md:col-span-2 rounded-md border border-gray-300 px-2 py-2 text-sm"
                          placeholder="Description (EN)"
                          value={String(itemDrafts[item.id]?.description ?? '')}
                          onChange={(event) =>
                            setItemDrafts((current) => ({
                              ...current,
                              [item.id]: { ...current[item.id], description: event.target.value },
                            }))
                          }
                        />
                        <textarea
                          className="md:col-span-2 rounded-md border border-gray-300 px-2 py-2 text-sm"
                          placeholder="Description (ZH)"
                          value={String(itemDrafts[item.id]?.description_zh ?? '')}
                          onChange={(event) =>
                            setItemDrafts((current) => ({
                              ...current,
                              [item.id]: { ...current[item.id], description_zh: event.target.value },
                            }))
                          }
                        />
                        <input
                          className="md:col-span-2 rounded-md border border-gray-300 px-2 py-2 text-sm"
                          placeholder="Image URL"
                          value={String(itemDrafts[item.id]?.image ?? '')}
                          onChange={(event) =>
                            setItemDrafts((current) => ({
                              ...current,
                              [item.id]: { ...current[item.id], image: event.target.value },
                            }))
                          }
                        />
                        <div className="md:col-span-2 flex items-center gap-2">
                          <div className="h-12 w-16 overflow-hidden rounded border border-gray-200 bg-gray-50">
                            {itemDrafts[item.id]?.image ? (
                              <img
                                src={String(itemDrafts[item.id]?.image)}
                                alt={String(itemDrafts[item.id]?.name || item.name)}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setImageTargetItemId(item.id);
                              setShowImagePicker(true);
                            }}
                            className="rounded-md border border-gray-200 px-2 py-1.5 text-xs hover:bg-gray-50"
                          >
                            Choose
                          </button>
                        </div>
                        <input
                          className="rounded-md border border-gray-300 px-2 py-2 text-sm"
                          placeholder="Sort Order"
                          type="number"
                          value={Number(itemDrafts[item.id]?.sort_order ?? 0)}
                          onChange={(event) =>
                            setItemDrafts((current) => ({
                              ...current,
                              [item.id]: {
                                ...current[item.id],
                                sort_order: Number(event.target.value || 0),
                              },
                            }))
                          }
                        />
                        <label className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-2 py-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={itemDrafts[item.id]?.is_available !== false}
                            onChange={(event) =>
                              setItemDrafts((current) => ({
                                ...current,
                                [item.id]: { ...current[item.id], is_available: event.target.checked },
                              }))
                            }
                          />
                          Available
                        </label>
                        <label className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-2 py-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={itemDrafts[item.id]?.is_chef_signature === true}
                            onChange={(event) =>
                              setItemDrafts((current) => ({
                                ...current,
                                [item.id]: { ...current[item.id], is_chef_signature: event.target.checked },
                              }))
                            }
                          />
                          Signature
                        </label>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => saveItem(item.id)}
                          disabled={pendingKey === `save-item-${item.id}`}
                          className="rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                          Save Item
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          disabled={pendingKey === `delete-item-${item.id}`}
                          className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete Item
                        </button>
                      </div>
                    </div>
                  ))}
                  {categoryItems.length === 0 && (
                    <div className="rounded-md border border-dashed border-gray-200 px-3 py-4 text-sm text-gray-500">
                      No items in this category yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      {showDeleteTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Delete menu type?</h3>
            <p className="mt-2 text-sm text-gray-600">
              This will permanently delete:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Menu type: <code>{selectedMenuType}</code></li>
              <li>{selectedTypeCategories.length} categories</li>
              <li>{selectedTypeItemCount} menu items</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Daily specials linked to deleted items are automatically removed.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteTypeModal(false)}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteSelectedMenuType}
                disabled={pendingKey === 'delete-menu-type'}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {pendingKey === 'delete-menu-type' ? 'Deleting...' : 'Delete Type'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ImagePickerModal
        open={showImagePicker}
        siteId={siteId}
        onClose={() => {
          setShowImagePicker(false);
          setImageTargetItemId(null);
        }}
        onSelect={(url) => {
          if (!imageTargetItemId) return;
          setItemDrafts((current) => ({
            ...current,
            [imageTargetItemId]: {
              ...current[imageTargetItemId],
              image: url,
            },
          }));
          setShowImagePicker(false);
          setImageTargetItemId(null);
        }}
      />
    </div>
  );
}
