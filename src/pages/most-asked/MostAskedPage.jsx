import { Accordion, Container, Text } from "@chakra-ui/react";
import AccordionComp from "./AccordionComp";

const MostAskedPage = () => {
	return (
		<Container maxW={"container.xl"}>
			<Text
				fontSize={{
					base: "3xl",
					md: "6xl",
				}}
				fontWeight={"bold"}
				mt={10}
				mb={5}
			>
				FAQS
			</Text>

			<Accordion allowToggle>
				<AccordionComp
					title={"	Can I participate in Erasmus without applying to my university?"}
					description={`Students can only participate in Erasmus+ mobility activities through their own universities.
          You cannot participate in Erasmus+ higher education student mobility activities through another
          university or institution.`}
				/>

				<AccordionComp
					title={"How can I find accommodation abroad?"}
					description={`There is no requirement for sending universities in Turkey or host institutions abroad to
          provide accommodation for students. Information about accommodation options in the city you will
          be traveling to is usually available on the website of the hosting institution or in acceptance
          documents. In addition to this, students often find accommodation through their own Erasmus
          connections or via social media platforms.`}
				/>

				<AccordionComp
					title={"I want to extend my activity period to the second term. Will I be eligible for a grant?"}
					description={`The extension of the activity period is subject to approval from both the student's home
        university in Turkey and the host university abroad. Whether the extended period will be funded
        depends on the grant opportunities available at the student's home university in Turkey. For
        information regarding eligibility for a grant, the Erasmus Office at the student's
        university in Turkey can provide assistance. If the period is extended, documents must be
        updated accordingly to reflect the current duration.`}
				/>
				<AccordionComp
					title={"I have already done Erasmus studies once, can I now do an internship?"}
					description={`Yes, you can do an Erasmus internship if you find an internship placement.`}
				/>
			</Accordion>
		</Container>
	);
};
export default MostAskedPage;
