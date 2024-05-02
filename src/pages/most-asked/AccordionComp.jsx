import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Text } from "@chakra-ui/react";

const AccordionComp = ({ title, description }) => {
	return (
		<AccordionItem>
			<h2>
				<AccordionButton>
					<Text
						as='span'
						textTransform={"uppercase"}
						fontSize={{
							sm: "xl",
							md: "2xl",
						}}
						fontWeight={"bold"}
						flex='1'
						textAlign='left'
					>
						{title}
					</Text>
					<AccordionIcon />
				</AccordionButton>
			</h2>
			<AccordionPanel pb={4} fontSize={"lg"}>
				{description}
			</AccordionPanel>
		</AccordionItem>
	);
};
export default AccordionComp;
