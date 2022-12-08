import { Text, Button } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
export default function FileContentModal({
	context,
	id,
	innerProps,
}: ContextModalProps<{ modalBody: string }>) {
	return (
		<>
			<Text
				size="sm"
				component="pre"
				style={{
					whiteSpace: "pre-wrap",
				}}
			>
				{innerProps.modalBody}
			</Text>
			<Button fullWidth mt="md" onClick={() => context.closeModal(id)}>
				Close modal
			</Button>
		</>
	);
}
