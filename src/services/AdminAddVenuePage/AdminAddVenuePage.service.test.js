import {fetchBuilding,createBuilding,fetchVenue,createVenue,fetchTag,updateTag,fetchFeature,addVenueFeature} from './AdminAddVenuePage.service'

// Mock the global fetch function
global.fetch = jest.fn();

afterEach(() => {
    jest.resetAllMocks();
});

describe('fetchBuilding function', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock after each test
  });

  it('should return the building when it exists', async () => {
    const mockBuildingName = 'Engineering Block';
    const mockResponse = {
      value: [
        { BUILDING_ID: 1, BUILDING_NAME: 'Engineering Block', BUILDING_LOCATION: 'North Campus' },
        { BUILDING_ID: 2, BUILDING_NAME: 'Science Block', BUILDING_LOCATION: 'East Campus' },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchBuilding(mockBuildingName);
    expect(result).toEqual({
      BUILDING_ID: 1,
      BUILDING_NAME: 'Engineering Block',
      BUILDING_LOCATION: 'North Campus',
    });
  });

  it('should return null when the building does not exist', async () => {
    const mockBuildingName = 'Nonexistent Block';
    const mockResponse = {
      value: [
        { BUILDING_ID: 1, BUILDING_NAME: 'Engineering Block', BUILDING_LOCATION: 'North Campus' },
        { BUILDING_ID: 2, BUILDING_NAME: 'Science Block', BUILDING_LOCATION: 'East Campus' },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchBuilding(mockBuildingName);
    expect(result).toBeNull();
  });

  it('should throw an error when the API call fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    await expect(fetchBuilding('Engineering Block')).rejects.toThrow('HTTP error! Status: 500, Message: Internal Server Error');
  });

  it('should throw an error when the fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchBuilding('Engineering Block')).rejects.toThrow('Network Error');
  });
});

describe('createBuilding function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock after each test
    });
  
    it('should create a building and return its details', async () => {
      const mockBuilding = {
        value: [
          { BUILDING_ID: 1, BUILDING_NAME: 'Engineering Block', BUILDING_LOCATION: 'North Campus' },
        ],
      };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBuilding,
      });
  
      const result = await createBuilding('Engineering Block', 'North Campus');
  
      expect(result).toEqual({
        BUILDING_ID: 1,
        BUILDING_NAME: 'Engineering Block',
        BUILDING_LOCATION: 'North Campus',
      });
    });
  
    it('should throw an error if the building ID is not found in the response', async () => {
      const mockResponse = { value: [] }; // Empty value array
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      await expect(createBuilding('Science Block', 'East Campus')).rejects.toThrow('Building ID not found in response');
    });
  
    it('should throw an error when the API call fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });
  
      await expect(createBuilding('Engineering Block', 'North Campus')).rejects.toThrow('HTTP error! Status: 500, Message: Internal Server Error');
    });
  });

  describe('fetchVenue function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock after each test
    });
  
    it('should fetch the venue when it exists', async () => {
      const mockResponse = {
        value: [{ VENUE_ID: 1, VENUE_NAME: 'Lecture Hall', VENUE_CAPACITY: 100, VENUE_STATUS: 'Available' }],
      };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await fetchVenue('Lecture Hall');
      expect(result).toEqual(mockResponse.value[0]);
    });
  
    it('should return null when the venue does not exist', async () => {
      const mockResponse = { value: [] }; // No venues
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await fetchVenue('Nonexistent Venue');
      expect(result).toBeNull();
    });
  
    it('should throw an error when the API call fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });
  
      await expect(fetchVenue('Lecture Hall')).rejects.toThrow('HTTP error! Status: 404, Message: Not Found');
    });
  });

  describe('fetchTag function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock after each test
    });
  
    it('should return the tag ID when the tag exists', async () => {
      const mockResponse = {
        value: [{ TAG_ID: 1, TAG_NAME: 'Study', TAG_DESCRIPTION: 'Study Related Tag' }],
      };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await fetchTag('Study');
      expect(result).toBe(1);
    });
  
    it('should return null when the tag does not exist', async () => {
      const mockResponse = { value: [] }; // No tags
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await fetchTag('Nonexistent Tag');
      expect(result).toBeNull();
    });
  
    it('should throw an error when the API call fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });
  
      await expect(fetchTag('Study')).rejects.toThrow('HTTP error! Status: 404, Message: Not Found');
    });
  });

  describe('updateTag function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock after each test
    });
  
    it('should update the tag and return the result', async () => {
      const mockResponse = { success: true };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await updateTag(1, 1);
      expect(result).toEqual(mockResponse);
    });
  
    it('should throw an error when the API call fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });
  
      await expect(updateTag(1, 1)).rejects.toThrow('HTTP error! Status: 500, Message: Internal Server Error');
    });
  });

  describe('fetchFeature function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock after each test
    });
  
    it('should return the feature ID when the feature exists', async () => {
      const mockResponse = {
        value: [{ FEATURE_ID: 1, FEATURE_NAME: 'Projector', DESCRIPTION: 'Multimedia Projector' }],
      };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await fetchFeature('Projector');
      expect(result).toBe(1);
    });
  
    it('should return null when the feature does not exist', async () => {
      const mockResponse = { value: [] }; // No features
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await fetchFeature('Nonexistent Feature');
      expect(result).toBeNull();
    });
  
    it('should throw an error when the API call fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      });
  
      await expect(fetchFeature('Projector')).rejects.toThrow('HTTP error! Status: 404, Message: Not Found');
    });
  });

  describe('addVenueFeature function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock after each test
    });
  
    it('should add a feature to a venue and return the result', async () => {
      const mockResponse = { success: true };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await addVenueFeature(1, 1);
      expect(result).toEqual(mockResponse);
    });
  
    it('should throw an error when the API call fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });
  
      await expect(addVenueFeature(1, 1)).rejects.toThrow('HTTP error! Status: 500, Message: Internal Server Error');
    });
  });

  describe('createVenue function', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock after each test
    });
  
    it('should create a venue and return its details', async () => {
      const mockResponse = {
        value: [{ VENUE_ID: 1, VENUE_NAME: 'Auditorium', VENUE_CAPACITY: 200, VENUE_STATUS: 'Available' }],
      };
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      const result = await createVenue(1, 'Auditorium', 200);
      expect(result).toEqual(mockResponse.value[0]);
    });
  
    it('should throw an error if VENUE_ID is not found in the response', async () => {
      const mockResponse = { value: [] }; // Empty value array
  
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
  
      await expect(createVenue(1, 'Auditorium', 200)).rejects.toThrow('Create venue response is missing VENUE_ID.');
    });
  
    it('should throw an error when the API call fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error', // Add statusText here
        text: async () => 'Internal Server Error',
      });
  
      await expect(createVenue(1, 'Auditorium', 200)).rejects.toThrow('Failed to create venue: Internal Server Error');
    });
  });
  

