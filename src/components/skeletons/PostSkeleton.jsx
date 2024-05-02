import { Flex, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const PostSkeleton = () => {
	return (
		<Flex gap='2' padding='6' my={2} boxShadow='lg' w={"full"}>
			<SkeletonCircle size='10' />
			<Flex flexDir={"column"} w={"full"} gap='3'>
				<SkeletonText w={"full"} mt='4' noOfLines={3} spacing='4' skeletonHeight='2' />
				<Skeleton>
					<div>contents wrapped</div>
					<div>not visible</div>
					<div>not visible</div>
					<div>not visible</div>
				</Skeleton>
			</Flex>
		</Flex>
	);
};
export default PostSkeleton;
