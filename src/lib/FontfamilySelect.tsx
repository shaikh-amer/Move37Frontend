import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

function FontFamilySelect({
  fonts,
  selectedFont,
  onValueChange,
}: {
  fonts: { label: string; value: string }[];
  selectedFont: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select.Root value={selectedFont} onValueChange={onValueChange}>
      <Select.Trigger
        className="inline-flex items-center justify-between px-3 py-2 bg-gray-700 text-white rounded w-full "
        aria-label="Font Family"
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="bg-gray-800 text-white rounded shadow-md">
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-700 text-white">
            <ChevronDownIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1 h-[100px]">
            {fonts.map((f) => (
              <Select.Item
                key={f.value}
                value={f.value}
                className="relative flex items-center px-8 py-2 rounded cursor-pointer hover:bg-gray-600 "
              >
                <Select.ItemText>{f.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-700 text-white">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default FontFamilySelect;
