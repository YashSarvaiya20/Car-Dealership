package com.incubyte.dealership;

import com.mongodb.client.MongoClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class DealershipApplicationTests {

	@MockBean
	private MongoClient mongoClient;

	@Test
	void contextLoads() {
	}

}
