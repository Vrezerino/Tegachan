'use client'

const Updates = () => {
  return (
    <section
      className='mx-auto mb-3 w-full max-w-md p-2 bg-white border border-neutral-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 dark:bg-neutral-900 dark:border-neutral-800' data-testid='updates'
      aria-labelledby='updates-heading '
    >
      <header>
        <h5
          id='updates-heading'
          className='mb-5 mx-auto text-xl text-center font-bold leading-none text-neutral-900 dark:header-darkmode'
        >UPDATES
        </h5>
      </header>
      
      <p className='text-sm font-medium text-neutral-900 dark:text-white' data-testid='update'>
        <b>09 Jun 2025</b>: Post num incrementation was dysfunctional after last downtime — posting is again possible
      </p>
    </section>
  )
}

export default Updates;