export const FrequentTrackerOccurrences = [
    //Short term travels
    //{interval: '1w', length: '1w'},
    {interval: '2w', length: '1w'},
    {interval: '1m', length: '2w'},
    //Medium term travels
    {interval: '2m', length: '1w'},
    {interval: '4m', length: '2w'},
    //Long term travels
    //{interval: '6m', length: '1w'},
    {interval: '9m', length: '2w'}
];

export const NB_TRACKERS = 6;
export const NB_TRACKERS_PER_USER = {
    REGISTERED: 6,
    VISITOR: 3
};
export const EARTH_RADIUS = 6371; // Radius of the earth in km
export const AIRPORT_TYPES = ['medium_airport', 'large_airport', 'multi_airport'];

export const TERMS_TYPES = {
    shortTerm: 'short_term',
    mediumTerm: 'medium_term',
    longTerm: 'long_term'
}
/** AUSTRALIA - Local
 * Melbourne - Sydney   X
 * Brisbane - Sydney    X
 * Brisbane - Melbourne X
 * Adelaide - Melbourne X
 * Melbourne - Perth    X
 * Perth - Sydney       X
 * Adelaide - Sydney    X
 * Hobart - Melbourne   X
 */

 /** AUSTRALIA - International
  * Sydney - Los Angeles    X
  * Sydney - London         X
  * Sydney - Paris          X
  * Sydney - Tokyo          X
  * Sydney - Beijing        X
  * Sydney - Hong Kong      X
  * Sydney - Bali           X
  * Sydney - Auckland       X
  * Syndey - Singapore      X
  * Sydney - Rio de Janeiro X
  */

 /** AMERICA
  * New York, Miami, Boston, Chicago, Washington, Dallas, San Francisco, Atlanta, Los Angeles, Seatle, 
  * Toronto, Vancouver, Mexico
  * 
  * New York - Miami   X
  * Los Angeles - New York  X
  * Los Angeles - San Francisco  X
  * New York - Chicago  X
  * New York - Toronto X
  */

  /** EUROPE
   * London, Paris, Berlin, Madrid, Rome, Dublin
   * Dublin - London
   * Paris - London X
   * London - Madrid X
   * London - Rome X
   * Paris - Madrid X
   * Paris - Rome X
   */

   /** ASIA
    * 
    * Hong Kong - Taipei X
    * Kuala Lumpur - Singapore X
    * Jakarta - Singapore X
    * Jakarta - Kuala Lumpur X
    * Hong Kong - Shanghai X
    * Hong Kong - Seoul (SEL) not existing
    * Beijing - Hong Kong X
    * Bangkok - Singapore X
    */

    /** FRANCE
     *  Paris, Marseille, Toulouse, Nice, Lyon
     *  Paris - Toulouse X
     *  Paris - Nice X
     *  Paris - Lyon X
     *  Paris - Marseille X
     */