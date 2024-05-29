import aboutStyles from './About.module.scss'
import containerStyles from '../../../library/genericStyles/containers.module.scss'
import heroPath from '../../../localAssets/aboutHero.jpeg'
import { Heading } from '@radix-ui/themes'

export const About = () => {
  return (
    <div className={aboutStyles.pageWrapper}>
      <img src={heroPath} className={aboutStyles.hero} />
      <main className={aboutStyles.main}>
        <Heading as="h1" size="7">
          About Title Here
        </Heading>
        <div className={containerStyles.flexRowStartStart}>
          <section>
            <Heading as="h2">Overview</Heading>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu
              tellus, dictum eu scelerisque vitae, sodales nec sapien.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae; Suspendisse in nibh faucibus, accumsan
              risus vel, vehicula nibh. Sed eget arcu id nisl malesuada feugiat.
            </p>
          </section>
          <section>
            <Heading as="h2">Purpose</Heading>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu
              tellus, dictum eu scelerisque vitae, sodales nec sapien.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae; Suspendisse in nibh faucibus, accumsan
              risus vel, vehicula nibh. Sed eget arcu id nisl malesuada feugiat.
            </p>
          </section>
        </div>
        <section>
          <Heading as="h2">How it Works</Heading>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu
            tellus, dictum eu scelerisque vitae, sodales nec sapien. Vestibulum
            ante ipsum primis in faucibus orci luctus et ultrices posuere
            cubilia curae; Suspendisse in nibh faucibus, accumsan risus vel,
            vehicula nibh. Sed eget arcu id nisl malesuada feugiat.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu
            tellus, dictum eu scelerisque vitae, sodales nec sapien. Vestibulum
            ante ipsum primis in faucibus orci luctus et ultrices posuere
            cubilia curae; Suspendisse in nibh faucibus, accumsan risus vel,
            vehicula nibh. Sed eget arcu id nisl malesuada feugiat.
          </p>
        </section>
        <section>
          <Heading as="h2">Team</Heading>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu
            tellus, dictum eu scelerisque vitae, sodales nec sapien. Vestibulum
            ante ipsum primis in faucibus orci luctus et ultrices posuere
            cubilia curae.
          </p>
          <div className={aboutStyles.teamImages}>
            <div className={aboutStyles.greyBox} />
            <div className={aboutStyles.greyBox} />
            <div className={aboutStyles.greyBox} />
            <div className={aboutStyles.greyBox} />
            <div className={aboutStyles.greyBox} />
            <div className={aboutStyles.greyBox} />
            <div className={aboutStyles.greyBox} />
            <div className={aboutStyles.greyBox} />
          </div>
        </section>
        <section>
          <Heading as="h2">Impact</Heading>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu
            tellus, dictum eu scelerisque vitae, sodales nec sapien. Vestibulum
            ante ipsum primis in faucibus orci luctus et ultrices posuere
            cubilia curae; Suspendisse in nibh faucibus, accumsan risus vel,
            vehicula nibh. Sed eget arcu id nisl malesuada feugiat.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras arcu
            tellus, dictum eu scelerisque vitae, sodales nec sapien. Vestibulum
            ante ipsum primis in faucibus orci luctus et ultrices posuere
            cubilia curae; Suspendisse in nibh faucibus, accumsan risus vel,
            vehicula nibh. Sed eget arcu id nisl malesuada feugiat.
          </p>
        </section>
      </main>
    </div>
  )
}
