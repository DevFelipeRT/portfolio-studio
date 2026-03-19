import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { tablePresets } from './presets';
import {
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableCard,
  TableBadge,
  TableBadgeButton,
  TableDetailDialog,
  TableEmptyState,
  TableHeaderRow,
} from './partials';
import { InteractiveTableRow } from './row';
import { SystemTable } from './Table';

type DemoItem = {
  id: number;
  name: string;
  summary: string;
  status: 'active' | 'draft' | 'archived';
  updatedAt: string;
};

const demoItems: DemoItem[] = [
  {
    id: 1,
    name: 'Landing page refresh',
    summary: 'Homepage update with stronger hero copy and clearer CTAs.',
    status: 'active',
    updatedAt: '2026-03-18',
  },
  {
    id: 2,
    name: 'Case study backlog',
    summary: 'Queued content batch waiting for editorial review.',
    status: 'draft',
    updatedAt: '2026-03-15',
  },
  {
    id: 3,
    name: 'Legacy promo block',
    summary: 'Old promotional section kept for reference before deletion.',
    status: 'archived',
    updatedAt: '2026-03-10',
  },
];

export function DemoTable() {
  const [selectedId, setSelectedId] = useState<number | null>(demoItems[0]?.id ?? null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedItem = demoItems.find((item) => item.id === selectedId) ?? null;

  return (
    <>
      <TableCard
        title="Common Table Demo"
        description="Exemplo de composicao usando a nova API compartilhada sem depender de um modulo de dominio."
        actions={
          <Button type="button" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New item
          </Button>
        }
      >
        <SystemTable layout="fixed">
          <TableHeader>
            <TableHeaderRow>
              <TableHead className={tablePresets.headerCell}>Item</TableHead>
              <TableHead className={tablePresets.headerCell}>Status</TableHead>
              <TableHead className={tablePresets.headerCell}>Updated</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {demoItems.length === 0 ? (
              <TableEmptyState
                colSpan={4}
                message="No items yet. Add the first record to populate this list."
              />
            ) : null}

            {demoItems.map((item) => {
              const isActive = isDialogOpen && selectedId === item.id;

              return (
                <InteractiveTableRow
                  key={item.id}
                  active={isActive}
                  interactive
                  variant="emphasized"
                  onActivate={() => {
                    setSelectedId(item.id);
                    setIsDialogOpen(true);
                  }}
                >
                  <TableCell className={tablePresets.summaryCell}>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-muted-foreground line-clamp-1 text-xs">
                        {item.summary}
                      </p>
                    </div>
                  </TableCell>

                <TableCell className={tablePresets.statusCell}>
                  <StatusBadge status={item.status} />
                </TableCell>

                  <TableCell className={tablePresets.metaCell}>
                    <span>{item.updatedAt}</span>
                  </TableCell>

                  <TableActionCell showChevron>
                    <TableActionsMenu triggerLabel={`Open actions for ${item.name}`}>
                      <TableActionsMenuItem
                        onClick={() => {
                          setSelectedId(item.id);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit item</span>
                      </TableActionsMenuItem>

                      <TableActionsMenuItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete item</span>
                      </TableActionsMenuItem>
                    </TableActionsMenu>
                  </TableActionCell>
                </InteractiveTableRow>
              );
            })}
          </TableBody>
        </SystemTable>
      </TableCard>

      <TableDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Demo row details"
        description="Exemplo de modal acionado por uma linha interativa da `common/table`."
      >
          {selectedItem ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Item</p>
                <p className="text-muted-foreground text-sm">{selectedItem.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Summary</p>
                <p className="text-muted-foreground text-sm">{selectedItem.summary}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <StatusBadge status={selectedItem.status} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Updated</p>
                  <p className="text-muted-foreground text-sm">
                    {selectedItem.updatedAt}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Interactive badge</p>
                  <TableBadgeButton
                    onClick={() => setIsDialogOpen(true)}
                    badgeClassName="bg-secondary text-secondary-foreground"
                  >
                    Toggle status
                  </TableBadgeButton>
                </div>
              </div>
            </div>
          ) : null}
      </TableDetailDialog>
    </>
  );
}

function StatusBadge({ status }: { status: DemoItem['status'] }) {
  const className =
    status === 'active'
      ? 'bg-primary text-primary-foreground'
      : status === 'draft'
        ? 'bg-muted text-muted-foreground'
        : 'bg-secondary text-secondary-foreground';

  return (
    <TableBadge
      className={`${className} flex w-fit items-center gap-1 px-2 py-0.5 text-xs font-medium`}
    >
      {status}
    </TableBadge>
  );
}
