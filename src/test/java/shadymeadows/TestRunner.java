package shadymeadows;

import com.intuit.karate.junit5.Karate;
import org.junit.jupiter.api.Test;

class TestRunner {

    @Test
    Karate testAll() {
        return Karate.run("classpath:shadymeadows").relativeTo(getClass());
    }
}
