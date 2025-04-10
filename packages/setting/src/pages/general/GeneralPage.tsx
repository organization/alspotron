import { Box, Text, Select } from '@alspotron/ui';

export const GeneralPage = () => {
  return (
    <Box p={'xl'} gap={'md'}>
      <Text variant={'h2'} my={'lg'}>
        일반 설정
      </Text>
      <Text variant={'title'}>
        일반 설정
      </Text>
      <Box
        direction={'row'}
        w={'100%'}
        r={'lg'}
        p={'lg'}
        gap={'md'}
        bd={'md'}
        bc={'surface.highest'}
        align={'center'}
        justify={'space-between'}
      >
        <Box gap={'xs'}>
          <Text variant={'body'}>
            언어 설정
          </Text>
          <Text variant={'caption'}>
            설정 설명인데 근데 굳이 설명을 넣어야함? 모르겠다
          </Text>
        </Box>
        <Select
          type={'default'}
          value={'ko-KR'}
          data={[
            { label: '한국어', value: 'ko-KR' },
            { label: 'English', value: 'en-US' },
          ]}
        />
      </Box>
    </Box>
  );
};
