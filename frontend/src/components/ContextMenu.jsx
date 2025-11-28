import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

const ContextMenu = ({ trigger, items = [] }) => (
  <ContextMenuPrimitive.Root>
    <ContextMenuPrimitive.Trigger asChild>{trigger}</ContextMenuPrimitive.Trigger>
    <ContextMenuPrimitive.Content className="min-w-[180px] rounded-xl border border-gray-200 bg-white p-1 shadow-xl">
      {items.map((item) =>
        item.type === "separator" ? (
          <ContextMenuPrimitive.Separator
            key={item.id}
            className="my-1 h-px bg-gray-100"
          />
        ) : (
          <ContextMenuPrimitive.Item
            key={item.id}
            onSelect={item.onSelect}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer focus:outline-none"
          >
            {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
            <span>{item.label}</span>
          </ContextMenuPrimitive.Item>
        ),
      )}
    </ContextMenuPrimitive.Content>
  </ContextMenuPrimitive.Root>
);

export default ContextMenu;
