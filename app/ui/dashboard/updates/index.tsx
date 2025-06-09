'use client'

const Updates = () => {
  return (
    <div className='mx-auto mb-8 w-full max-w-md p-2 bg-white border border-neutral-200 rounded-xs rounded-br-2xl shadow-sm sm:p-3 dark:bg-neutral-900 dark:border-neutral-800'>
      <h5 className='mb-5 mx-auto text-xl text-center font-bold leading-none text-neutral-900 dark:header-darkmode'>UPDATES</h5>
      <p className='text-sm font-medium text-neutral-900 dark:text-white' data-testid='total-posts-count'>
        <b>09 Jun 2025</b>: Post num incrementation was dysfunctional after last downtime — posting is again possible
      </p>
    </div>
  )
}

export default Updates;